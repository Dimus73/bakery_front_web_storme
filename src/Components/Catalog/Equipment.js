import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import './Ingredients.css';
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
import CatalogEquipmentValidation from "./Validation/CatalogEquipmentValidation";
import CatalogActionButton from "./ButtonAction/CatalogActionButton";


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

	const catalogActionButton = new CatalogActionButton (
		setCurrentItem,
		updateOneEquipment,
		addEquipment,
		updateEquipment,
		setCurrentItem,
		user.token);

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
// Function for saving an equipment
// ----------------------------------------------
	async function  addEquipment (item, token) {
		const equipment = item.equipment;
		const quantity = item.quantity;
		if (CatalogEquipmentValidation.dataValidation (equipment, quantity, setModalMessage)
			&& CatalogEquipmentValidation.nameAddValidation (equipment, equipments, setModalMessage) ) {
			await addNewEquipment ( item, user.token );
		}
	}

// ----------------------------------------------
// Function for updating an equipment
// ----------------------------------------------
	async function updateEquipment (item, token) {
		if ( CatalogEquipmentValidation.dataValidation(item.equipment, item.quantity, setModalMessage)
			&& CatalogEquipmentValidation.nameUpdateValidation(item.id, item.equipment, equipments, setModalMessage) ){
			await updateOneEquipment (item, token);
		} else {
			console.log('Not valid. currentItem =>', currentItem);
		}

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

export default Equipment