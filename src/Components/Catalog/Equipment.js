import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'
import { setLoader } from '../../redux/action';
import CatalogTable from "./Elements/CatalogTable";
import EquipmentUpdateForm from "./Elements/EquipmentUpdateForm";
import EquipmentAddForm from "./Elements/EquipmentAddForm";
import { useList } from "./Hooks/useList";
import SearchForm from "./Elements/SearchForm";
import Breadcrumbs from "./UI/breadcrumbs/Breadcrumbs";
import SearchSection from "./UI/search_section/SearchSection";
import TableSection from "./UI/folder_section/TableSection";
import EnterSection from "./UI/enter_section/EnterSection";
import WhitePageSection from "./UI/white_page_section/WhitePageSection";
import CatalogEquipmentService from "./API/CatalogEquipmentService";
import {useFetching} from "./Hooks/useFetching";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const URL = BASE_URL + '/api/catalog/';
const URL_Equipment = 'equipment';



const Equipment = () =>{
	const [equipments, setEquipments] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', quantity:''});
	const [searchStr, setSearchStr] = useState('');
	const equipmentsFiltered = useList(equipments, 'equipment', searchStr);

	const user = useSelector (state => state.user)

	const dispatch = useDispatch();

	const [loadEquipment, messageError] = useFetching (async () => {
		const data = await CatalogEquipmentService.allEquipments(user.token);
		setEquipments(data);
	})

	const fieldsList = [
		{
			fieldName : 'Equipment',
			justify : 'start',
			width : '',
			fieldNameInList: 'equipment'
		},
		{
			fieldName : 'Quantity',
			justify : 'end',
			width : 1,
			fieldNameInList: 'quantity'
		}
]


	const getRequest = (URL, toDo) => {
		const reqData = {
			method: "GET",
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		dispatch (setLoader(true));
		fetch(URL, reqData)
		.then(data =>  {
			// console.log('From Get:', data);
			dispatch (setLoader(false));
			if (!data.ok) {
				throw new Error (`Error getting data. Status ${data.status}. Message `)
			}
			return data.json()
		})
		.then(data => {
			toDo(data)
		})
		.catch((err) => {
			dispatch (setLoader(false));
			alert ('There was a communication error with the server while reading data. Check server operation and try again.')
			console.log('getRequest ERROR:', err);
		})
	}

	useEffect(()=>{
		const t = async () => {
			await loadEquipment()
		}
		t();
		// getRequest(URL+URL_Equipment, setEquipments);
		// const data = await
	}, []);


// ----------------------------------------------
// Data validation before saving
// ----------------------------------------------
	const dataValidation = (name, quantity) => {
		if (!FieldCheck(name)) {
			alert ("The field contains an invalid word. Please don't use words: ['SELECT', 'INSERT', 'DELETE', 'UPDATE']")
		} else if (!name){
			alert ("The Ingredient field cannot be empty")
		} else if (!quantity){
			alert ("The Quantity field cannot be empty")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Name validation before saving
// ----------------------------------------------
	const nameAddValidation = (name) => {
		if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase())) ){
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
		if ( equipments.some ((value) => (value.equipment.toLowerCase() === name.toLowerCase() && value.id !== id)) ){
			alert ("This ingredient is already in the database. Duplicate ingredients are not allowed.")
		} else {
			return true;
		}		
		return false;
	}

// ----------------------------------------------
// Function for adding an equipment
// ----------------------------------------------
	const addEquipment = (item) =>{

		const equipment = item.equipment;
		const quantity = item.quantity;
		console.log('From Add =>', equipment, quantity);
//Checking data for validity.
		if (dataValidation (equipment, quantity) && nameAddValidation (equipment) ) {
// Sending data to the server
			const reqData = {
				method: "POST",
				headers:{
					'Content-type' : 'application/json',
					'Authorization' : 'Bearer ' + user.token
				},
				body:JSON.stringify({
					equipment,
					quantity
				})
			}

			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});

			fetch (URL+URL_Equipment, reqData)
			.then (data=> data.json())
			.then (data => {
				setEquipments(data)})
			.catch(err => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log("ERROR when saving data", err)
			})
		}
	}

// ----------------------------------------------
// Function for updating an equipment
// ----------------------------------------------
	const updateEquipment = (item) => {
		console.log('Update function =>', item);
		if ( dataValidation(item.equipment, item.quantity) && nameUpdateValidation(item.id, item.equipment) ){
			const reqData = {
				method : 'PUT',
				headers : {
					'Content-type':'application/json',
					'Authorization' : 'Bearer ' + user.token

				},
				body : JSON.stringify ({
					id : item.id,
					equipment : item.equipment,
					quantity : item.quantity,
					active : item.active
				})
			}

			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});

			fetch (URL+URL_Equipment, reqData)
			.then (data => data.json())
			.then (data => setEquipments(data)) 
			.catch((err) => {
				alert ('There was a communication error with the server while saving data. Check server operation and try again.')
				console.log('getRequest ERROR:', err);
			})
	
		} else {
			console.log('Not valid. currentItem =>', currentItem);
		}

	}

// ----------------------------------------------
// Push Edit button in list (update an ingredient)
// ----------------------------------------------
	const pushEditButton = (item) => {
		console.log('Push Edit button in lis', {...item});
		setCurrentItem ({...item})
	}

// ----------------------------------------------
// Push Deactivate button in list (update an ingredient)
// ----------------------------------------------
	const pushDeactivateButton = (item) => {
		console.log('pushDeactivateButton =>', item)
		updateEquipment ({...item, active: false})
	}

// ----------------------------------------------
// Push ADD button in add form (add new ingredient)
// ----------------------------------------------
	const addElement = (item) => {
		addEquipment(item);
	}

// ----------------------------------------------
// Push Cancel button in update form an equipment
// ----------------------------------------------
	const cancelUpdate = () => {
		setCurrentItem ({id:'', name:'', quantity:''});
	}




	return (
	<div>
		<Breadcrumbs >
			Catalog | Equipment
		</Breadcrumbs>
		<Breadcrumbs>
			{messageError}
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
					elementsList = {equipmentsFiltered}
					pushEditButton = {pushEditButton}
					pushDeactivateButton = {pushDeactivateButton}
				/>
			</TableSection>
			<EnterSection>
				{currentItem.equipment ?
					<EquipmentUpdateForm currentItem = {currentItem} updateEquipment={updateEquipment} cancelUpdate={cancelUpdate} />
					:
					<EquipmentAddForm currentItem = {currentItem} addElement={addElement} />
				}
			</EnterSection>
		</WhitePageSection>
	</div>
	)
}


export default Equipment
