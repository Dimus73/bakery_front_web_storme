import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'
import { setLoader } from '../../redux/action';
import TableSection from "./UI/folder_section/TableSection";
import CatalogTable from "./Elements/CatalogTable";
import catalogActionButton from "./ButtonAction/CatalogActionButton";
import SearchSection from "./UI/search_section/SearchSection";
import SearchForm from "./Elements/SearchForm";
import EnterSection from "./UI/enter_section/EnterSection";
import EquipmentUpdateForm from "./Elements/EquipmentUpdateForm";
import EquipmentAddForm from "./Elements/EquipmentAddForm";
import Breadcrumbs from "./UI/breadcrumbs/Breadcrumbs";
import WhitePageSection from "./UI/white_page_section/WhitePageSection";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const URL = BASE_URL + '/api/catalog/';
const URL_Ingredients = 'ingredients';
const URL_Units = 'units';

const Ingredients = () =>{
	const [ingredients, setIngredients] =useState([]);
	const [ingredientsFiltered, setIngredientsFiltered] =useState([]);
	const [units, setUnits] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', unit_id:1});
	const [searchStr, setSearchStr] = useState('');

	const [showModal, setShowModal] = useState(false);

	const user = useSelector (state => state.user);
	const dispatch = useDispatch();



	const fieldsList = [
		{
			fieldName : 'Name',
			justify : 'start',
			width : '',
			fieldNameInList: 'name'
		},
		{
			fieldName : 'Unit',
			justify : 'end',
			width : 1,
			fieldNameInList: 'unit_name'
		},
		{
			fieldName : 'Short unit',
			justify : 'end',
			width : 2,
			fieldNameInList: 'unit_short_name'
		},
	]

	const getRequest = (URL, toDo) => {
		const reqData = {
			method: "GET",
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}
		
		dispatch ( setLoader( true ) );
		fetch(URL, reqData)
		.then(data =>  {
			dispatch ( setLoader( false ) );
			// console.log('From Get:', data);
			if (!data.ok) {
				throw new Error (`Error getting data. Status ${data.status}. Message `)
			}
			return data.json()
		})
		.then(data => {
			toDo(data)
		})
		.catch((err) => {
			alert ('There was a communication error with the server while reading data. Check server operation and try again.')
			console.log('getRequest ERROR:', err);
		})
	}

	
	useEffect(()=>{
		getRequest(URL+URL_Ingredients, setIngredients);
		getRequest (URL+URL_Units, setUnits )	
	}, []);

	useEffect (() =>{
			setIngredientsFiltered (ingredients.filter((value) => 
									searchStr ? value.name.toLowerCase().indexOf( searchStr.toLowerCase() ) !== -1 : true))
	}, [ingredients, searchStr])	

// ----------------------------------------------
// Data validation before saving
// ----------------------------------------------
	const dataValidation = (name, unit_id) => {
		if (!FieldCheck(name)) {
			alert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
		} else if (!name){
			alert ("The Ingredient field cannot be empty")
		} else if (unit_id == 1){
			alert ("Choose a unit of measure")
		}  else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before saving
// ----------------------------------------------
	const nameAddValidation = (name) => {
		if ( ingredients.some ((value) => (value.name.toLowerCase() == name.toLowerCase())) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before update
// ----------------------------------------------
const nameUpdateValidation = (id, name) => {
		if ( ingredients.some ((value) => (value.name.toLowerCase() == name.toLowerCase() && value.id != id)) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Function for adding an ingredient
// ----------------------------------------------
	const addIngredients = (e) =>{
		e.preventDefault();

		const name = e.target.elements.iName.value;
		const unit_id = e.target.elements.iUnit.value;

//Checking data for validity.
		if (dataValidation (name, unit_id) && nameAddValidation (name) ) {
// Sending data to the server
			const reqData = {
				method: "POST",
				headers:{
					'Content-type':'application/json',
					'Authorization' : 'Bearer ' + user.token,
				},
				body:JSON.stringify({
					name,
					unit_id
				})
			}

			setCurrentItem ({id:'', name:'', unit_id:1});

			dispatch ( setLoader (true) );
			fetch (URL+URL_Ingredients, reqData)
			.then (data=> data.json())
			.then (data => {
				dispatch ( setLoader (false) );
				setIngredients(data)})
			.catch(err => {
				dispatch ( setLoader (false) );
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log("ERROR when saving data", err)
			})
		}
	}

// ----------------------------------------------
// Function for updating an ingredient
// ----------------------------------------------
	const updateIngredient = (item) => {
		if ( dataValidation(item.name, item.unit_id) && nameUpdateValidation(item.id, item.name) ){
			const reqData = {
				method : 'PUT',
				headers : {
					'Content-type':'application/json',
					'Authorization' : 'Bearer ' + user.token,
				},
				body : JSON.stringify ({
					id : item.id,
					name : item.name,
					unit_id : item.unit_id,
					active : item.active
				})
			}

			setCurrentItem ({id:'', name:'', unit_id:1});

			dispatch ( setLoader (true) );
			fetch (URL+URL_Ingredients, reqData)
			.then (data => {
				dispatch ( setLoader(false) );
				return data.json();
			})
			.then (data => setIngredients(data)) 
			.catch((err) => {
				dispatch ( setLoader (false) );
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log('getRequest ERROR:', err);
			})
	
		} else {
			console.log('Not valid. currentItem =>', currentItem);
		}

	}
// ----------------------------------------------
// Function for Cancel update an ingredient
// ----------------------------------------------
	const cancelUpdate = () => {
		setCurrentItem ({id:'', name : '', unit_id : ''})
	}
// ----------------------------------------------
// Push Edit button (update an ingredient)
// ----------------------------------------------
	const pushEditButton = (item) => {
		setCurrentItem ({
			id:item.id, 
			name : item.name, 
			unit_id : item.unit_id,
			active : item.active
		})
	}

	// console.log('ingredientsFiltered =>', ingredientsFiltered);

	const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (e) => {
		e.preventDefault()
    setShowModal(true);
  };


	return (
	<div>
		<Breadcrumbs >
			Catalog | Equipment
		</Breadcrumbs>
		<WhitePageSection>
			<SearchSection>
				<SearchForm
					searchStr={searchStr}
					setSearchStr={setSearchStr}
				/>
			</SearchSection>
			<TableSection>
				<CatalogTable
					fieldsList = {fieldsList}
					elementsList = {ingredientsFiltered}
					catalogActionButton = {catalogActionButton}
				/>
			</TableSection>
			<EnterSection>
				{currentItem.equipment ?
					<EquipmentUpdateForm
						currentItem = {currentItem}
						catalogActionButton={catalogActionButton}
					/>
					:
					<EquipmentAddForm
						currentItem = {currentItem}
						catalogActionButton={catalogActionButton}
					/>
				}
			</EnterSection>
		</WhitePageSection>
	</div>
	)
}

export default Ingredients