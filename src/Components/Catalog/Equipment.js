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
import ModalWindow from "../UI/Modal/ModalWindow";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const URL = BASE_URL + '/api/catalog/';
const URL_Equipment = 'equipment';



const Equipment = () =>{
	const [equipments, setEquipments] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', quantity:''});
	const [searchStr, setSearchStr] = useState('');
	const [modalMessage, setModalMessage] = useState('false')
	const equipmentsFiltered = useList(equipments, 'equipment', searchStr);

	const user = useSelector (state => state.user)

	const dispatch = useDispatch();

	const [loadEquipment, loadEquipmentMessageError, loadEquipmentClearMessageError] =
		useFetching (async () => {
			const data = await CatalogEquipmentService.allEquipments(user.token);
			setEquipments(data);
	})

	const [addNewEquipment, addNewEquipmentMessageError, addNewEquipmentClearMessageError] =
		useFetching (async (item, token) => {
			const response = await CatalogEquipmentService.addEquipment(  item, token );
			setEquipments( response );
			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});
	})

	const [updateOneEquipment, updateOneEquipmentMessageError, updateOneEquipmentClearMessageError] =
		useFetching (async (item, token) => {
			const response = await CatalogEquipmentService.updateEquipment( item, token );
			setEquipments( response );
			setCurrentItem ({id:'', equipment:'', quantity:'', active:false});
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


	useEffect(()=>{
		const t = async () => {
			await loadEquipment()
		}
		t();
	}, []);

	useEffect( () => {
		setModalMessage(loadEquipmentMessageError +
			addNewEquipmentMessageError +
			updateOneEquipmentMessageError
			);
		},
		[loadEquipmentMessageError, addNewEquipmentMessageError, updateOneEquipmentMessageError]
	)


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
	const addEquipment = async (item) =>{

		const equipment = item.equipment;
		const quantity = item.quantity;
//Checking data for validity.
		if (dataValidation (equipment, quantity) && nameAddValidation (equipment) ) {
// Sending data to the server
			await addNewEquipment ( item, user.token );
		}
	}

// ----------------------------------------------
// Function for updating an equipment
// ----------------------------------------------
	const updateEquipment = async (item) => {
		console.log('Update function =>', item);
		if ( dataValidation(item.equipment, item.quantity) && nameUpdateValidation(item.id, item.equipment) ){
			await updateOneEquipment (item, user.token);
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


// ----------------------------------------------
// Clear alert message after API
// ----------------------------------------------
	const clearAllMessages = () => {
		if (addNewEquipmentMessageError) {
			addNewEquipmentClearMessageError();
		}
		if (loadEquipmentMessageError) {
			loadEquipmentClearMessageError();
		}
		if (updateOneEquipmentMessageError){
			updateOneEquipmentClearMessageError();
		}
		setModalMessage('');
	}

	return (
	<div>
		{modalMessage &&
			<ModalWindow title={'Error'} body={modalMessage} closeAction={clearAllMessages}/>}
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
