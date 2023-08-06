import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import TableSection from "./UI/folder_section/TableSection";
import CatalogTable from "./Elements/CatalogTable";
import SearchSection from "./UI/search_section/SearchSection";
import SearchForm from "./Elements/SearchForm";
import EnterSection from "./UI/enter_section/EnterSection";
import IngredientUpdateForm from "./Elements/IngredientUpdateForm";
import IngredientAddForm from "./Elements/IngredientAddForm";
import Breadcrumbs from "../UI/breadcrumbs/Breadcrumbs";
import WhitePageSection from "./UI/white_page_section/WhitePageSection";
import CatalogActionButton from "./ButtonAction/CatalogActionButton";
import ModalWindow from "../UI/Modal/ModalWindow";
import {useFetching} from "../Hooks/useFetching";
import CatalogIngredientsService from "./API/CatalogIngredientService";
import {useList} from "./Hooks/useList";
import CatalogIngredientValidation from "./Validation/catalogIngredientValidation";
import {tableFieldType} from "../UI/Table/tableFieldType";
import {tableActionType} from "../UI/Table/tableActionsType";
import BaseTable from "../UI/Table/BaseTable";

const Ingredients = () =>{
	const [ingredients, setIngredients] =useState([]);
	const [searchStr, setSearchStr] = useState('');
	const ingredientsFiltered= useList(ingredients, 'name', searchStr);
	const [units, setUnits] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', unit_id:1});
	const [modalMessage, setModalMessage] = useState('false')

	const user = useSelector (state => state.user);
	const dispatch = useDispatch();

	const [loadIngredient, loadIngredientMessageError, loadIngredientClearMessageError] =
		useFetching (async () => {
			const data = await CatalogIngredientsService.allIngredient(user.token);
			setIngredients(data);
		})

	const [loadUnit, loadUnitMessageError, loadUnitClearMessageError] =
		useFetching (async () => {
			const data = await CatalogIngredientsService.allUnits(user.token);
			setUnits(data);
		})

	const [addNewIngredient, addNewIngredientMessageError, addNewIngredientClearMessageError] =
		useFetching (async (item, token) => {
			const response = await CatalogIngredientsService.addIngredient(  item, token );
			setIngredients( response );
			console.log('*********************',currentItem);
			setCurrentItem ({id:'', name:'', unit_id:1});
		})

	const [updateOneIngredient, updateOneIngredientMessageError, updateOneIngredientClearMessageError] =
		useFetching (async (item, token) => {
			const response = await CatalogIngredientsService.updateIngredient( item, token );
			setIngredients( response );
			setCurrentItem ({id:'', name:'', unit_id:1});
		})


	const catalogActionButton = new CatalogActionButton (
		setCurrentItem,
		updateIngredient,
		addIngredients,
		updateIngredient,
		setCurrentItem,
		user.token);

	const fieldsList = [
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'Name',
			justify : 'start',
			width : '',
			fieldNameInList: 'name'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'Unit',
			justify : 'end',
			width : 1,
			fieldNameInList: 'unit_name'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'Short unit',
			justify : 'end',
			width : 2,
			fieldNameInList: 'unit_short_name'
		},
		{
			fieldType: tableFieldType.ACTION_FIELD,
			actionType: tableActionType.EDIT,
			justify: 'end',
			width: 1,
			action: catalogActionButton.pushEditButton,
		},
		{
			fieldType: tableFieldType.ACTION_FIELD,
			actionType: tableActionType.REMOVE,
			justify: 'end',
			width: 1,
			action: catalogActionButton.pushDeactivateButton,
		},

	]


	useEffect(()=>{
		const t = async () => {
			await loadIngredient();
			await loadUnit();
		}
		t ();
	}, []);

	useEffect( () => {
		setModalMessage(loadIngredientMessageError +
			loadUnitMessageError +
			addNewIngredientMessageError +
			updateOneIngredientMessageError
		);
	},
		[loadIngredientMessageError, loadUnitMessageError, addNewIngredientMessageError, updateOneIngredientMessageError]
	)



// ----------------------------------------------
// Function for adding an ingredient
// ----------------------------------------------
	async function addIngredients (item) {
		const {name, unit_id} = {...item};
		if (CatalogIngredientValidation.dataValidation (name, unit_id, setModalMessage)
			&& CatalogIngredientValidation.nameAddValidation (name, ingredients, setModalMessage) ) {
			await addNewIngredient ( item, user.token );
		}
	}

// ----------------------------------------------
// Function for updating an ingredient
// ----------------------------------------------
	async function updateIngredient (item) {
		const {id, name, unit_id} = {...item};
		if ( CatalogIngredientValidation.dataValidation(name, unit_id, setModalMessage)
			&& CatalogIngredientValidation.nameUpdateValidation(id, name, ingredients, setModalMessage) ){
			await updateOneIngredient ( item, user.token );
		} else {
			setModalMessage(`Not valid. currentItem => ${currentItem}`);
		}
	}

// ----------------------------------------------
// Clear alert message after API
// ----------------------------------------------
	const clearAllMessages = () => {
		if (loadIngredientMessageError) {
			loadIngredientClearMessageError();
		}
		if (loadUnitMessageError) {
			loadUnitClearMessageError();
		}
		if (addNewIngredientMessageError) {
			addNewIngredientClearMessageError();
		}
		if (updateOneIngredientMessageError){
			updateOneIngredientClearMessageError();
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
				{/*<CatalogTable*/}
				{/*	fieldsList = {fieldsList}*/}
				{/*	elementsList = {ingredientsFiltered}*/}
				{/*	catalogActionButton = {catalogActionButton}*/}
				{/*/>*/}
				<BaseTable
					fieldsList = {fieldsList}
					elementsList = {ingredientsFiltered}
					catalogActionButton = {catalogActionButton}
				/>
			</TableSection>
			<EnterSection>
				{currentItem.name ?
					<IngredientUpdateForm
						currentItem = {currentItem}
						units={units}
						catalogActionButton={catalogActionButton}
					/>
					:
					<IngredientAddForm
						currentItem = {currentItem}
						units={units}
						catalogActionButton={catalogActionButton}
					/>
				}
			</EnterSection>
		</WhitePageSection>
	</div>
	)
}

export default Ingredients