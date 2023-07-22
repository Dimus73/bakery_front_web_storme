import { useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FieldCheck } from '../../Utils/Fieldcheck';
import './Ingredients.css';
import { Button, Modal } from 'react-bootstrap'
import { setLoader } from '../../redux/action';
import CatalogTable from "./Elements/CatalogTable";
import UpdateForm from "./Elements/UpdateForm";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const URL = BASE_URL + '/api/catalog/';
const URL_Equipment = 'equipment';


const Equipment = () =>{
	const [equipments, setEquipments] =useState([]);
	const [equipmentsFiltered, setEquipmentsFiltered] =useState([]);
	const [currentItem, setCurrentItem] = useState({id:'', name:'', quantity:''});
	const [searchStr, setSearchStr] = useState('');

	const [showModal, setShowModal] = useState(false);

	const user = useSelector (state => state.user)

	const dispatch = useDispatch();

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
		getRequest(URL+URL_Equipment, setEquipments);
	}, []);

	useEffect (() =>{
			setEquipmentsFiltered (equipments.filter((value) => 
									searchStr ? value.equipment.toLowerCase().indexOf( searchStr.toLowerCase() ) !== -1 : true))
	}, [equipments, searchStr])	

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
	const addEquipment = (e) =>{
		e.preventDefault();

		const equipment = e.target.elements.equipment.value;
		const quantity = e.target.elements.quantity.value;
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
// Function for Cancel update an equipment
// ----------------------------------------------
	const cancelUpdate = () => {
		setCurrentItem ({id:'', equipment:'', quantity:0});
	}
// ----------------------------------------------
// Push Edit button (update an ingredient)
// ----------------------------------------------
	const pushEditButton = (item) => {
		setCurrentItem ({id : item.id, equipment : item.equipment, quantity : item.quantity, active : item.active})
	}

// ----------------------------------------------
// Push Deactivate button (update an ingredient)
// ----------------------------------------------
	const pushDeactivateButton = (item) => {
		console.log('pushDeactivateButton =>', item)
		updateEquipment ({...item, active: false})
	}

	// console.log('ingredientsFiltered =>', ingredientsFiltered);

	const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (e) => {
		e.preventDefault();
    setShowModal(true);
  };

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

	return (
	<div className='container'>
		<h6 className=''>Catalog | Equipment</h6	>
		<div className='container bg-white p-5 shadow-lg'>
			<div className='row font-comfortaa'>
			<div className='col-lg-2'></div>
				<div className='col-12 col-lg-4'>
						<form action="">
							<div className='row'>
								<div className='col-10'>
									<input className='form-control' type="text" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} placeholder='Enter to filter'/>
								</div>
								<div className='col-1'>
									<i className="bi bi-x-square" style={{'font-size': '1.8rem', color: "#BD302D"}} onClick={(e) => { e.preventDefault(); setSearchStr('') }}></i>
								</div>
							</div>
						</form>
				</div>
			</div>
			<div className='row justify-content-md-center'>
				<div className=' col-12 col-lg-8 mt-3 p-3' >
					<div className='scroll_div'>
						<CatalogTable
							fieldsList = {fieldsList}
							elementsList = {equipmentsFiltered}
							pushEditButton = {pushEditButton}
							pushDeactivateButton = {pushDeactivateButton}
						/>
					</div>
				</div>
			</div>
		<div>
		</div >
			<div className='row justify-content-md-start'>
			<div className='col-lg-2'></div>
			<div className='form-box col-12 col-lg-6 mt-3 p-3'>
					{currentItem.equipment ?
						<UpdateForm item = {currentItem} updateEquipment={updateEquipment} cancelUpdate={cancelUpdate} />
						:
						<AddForm item = {currentItem} addEquipment={addEquipment} />
					}
				</div>
			</div>
		</div>
		<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Модальное окно</Modal.Title>
        </Modal.Header>
        <Modal.Body>Содержимое модального окна</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Сохранить изменения
          </Button>
        </Modal.Footer>
      </Modal>

	</div>
	)
}


const AddForm = (props) => {
	const [currentItem, setCurrentItem] = useState({})

	useEffect (()=>{
		setCurrentItem({id:props.item.id, 
			equipment:props.item.equipment, 
			quantity:props.item.quantity})	
	},[props.item])	
		
	return (
		<>
			<div className='row'>
				<div>New</div>
			</div>
			<form className='font-comfortaa' onSubmit={props.addEquipment} action="">
				<div className='row justify-content-md-center' >
					<div className='col-7'>
						<input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, equipment:e.target.value}) }
									type="text" name='equipment'  value = {currentItem.equipment} placeholder="Enter equipment"/>
					</div>
					<div className='col-3'>
						<input className='form-control' onChange={(e) => setCurrentItem ({...currentItem, quantity:e.target.value}) }
									name='quantity' value = {currentItem.quantity} />
					</div>
					<div  className='col-1'>
						<button  className='btn m-1 me-md-2 btn-outline-danger' type='submit'>Add</button>
					</div>
				</div>
			</form>
		</>
	)
}


	export default Equipment
