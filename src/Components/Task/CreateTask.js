import { useState, useEffect } from 'react'
import { useSelector, useDispatch  } from 'react-redux'
import { setLoader } from '../../redux/action';
import { useNavigate, useParams } from "react-router-dom";
import { emptyRecipe } from '../Recipe/EmptyRecipe';
import  ResourcesUsed  from './ResourcesUsed';
import './CreateTask.css';
import Breadcrumbs from "../UI/breadcrumbs/Breadcrumbs";
import {tableActionType} from "../UI/Table/tableActionsType";
import {tableFieldType} from "../UI/Table/tableFieldType";
import BaseTable from "../UI/Table/BaseTable";
import MyButton from "../UI/Button/MyButton";
import TableSection from "./UI/TableSection";
import ButtonSection from "./UI/ButtonSection";
import DateInput from "./DateInput";
import DateSection from "./UI/DateSection";
import WhitePageSection from "./UI/WhitePageSection";
import * as PropTypes from "prop-types";
import ModalWindow from "../UI/Modal/ModalWindow";
import {useFetching} from "../Hooks/useFetching";
import TaskServiceAPI from "./API/TaskServiceAPI";
import {EDIT_MODE} from "./utils/createTaskMode";


const emptyTask = {
	taskId : 0,
	recipeId : '',
	recipeName : '',
	quantityInRecipe : 0,
	unit_name : "",
	quantity : '',
	totalQuantity : 0,
	inWork : false,
	isReady : false
}

// const EDIT_MODE ={
// 	CREATE : 'create',
// 	EDIT : 'edit',
// 	VIEW : 'view',
// }


const CreateTask = () => {

	// const [taskList, setTaskList] = useState( [ {...emptyTask} ] );

	const [recipeList, setRecipeList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)

	const [modalMessage, setModalMessage] = useState('');

	const [refreshResource, setRefreshResource] = useState(0);

	const user = useSelector ( (state) =>(state.user) )
	const dispatch = useDispatch ();
	const tDate = new Date()
	
	const [task, setTask] = useState({
		id : 0,
		date : tDate.toISOString().split('T')[0],
		inWork : false,
		isReady : false,
		user_id : user.userId,
		taskList : [{...emptyTask}]
	});

	const params = useParams();
	// console.log('PARAMS =>', params);
	const navigate = useNavigate();

	const [loadRecipe, loadRecipeMessageError, loadRecipeClearMessageError] =
		useFetching(async () => {
			const data = await TaskServiceAPI.getRecipeList();
			setRecipeList(data);
		})

	const [loadTask, loadTaskMessageError, loadTaskClearMessageError] =
		useFetching( async (id, token) => {
			const data = await TaskServiceAPI.getTask(id, token);
			setEditMode (EDIT_MODE.EDIT);

			const tDate = new Date(data.date)
			const year = tDate.getFullYear();
			const month = String(tDate.getMonth() + 1).padStart(2, '0');
			const day = String(tDate.getDate()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day}`;

			data.date = formattedDate;
			data.user_id = user.userId;
			data.taskList.push({});
			setTask({...data})
		})

	const [saveTask, saveTaskMessageError, saveTaskClearMessageError] =
		useFetching ( async ( id, token, mode, dataToSave ) => {
			const data = await TaskServiceAPI.saveTask(id, token, mode, dataToSave);
			setEditMode(EDIT_MODE.EDIT);
			const tDate = new Date(data.date)
			data.date = tDate.toISOString().split('T')[0];
			data.user_id = user.userId
			data.taskList.push ({});
			// console.log('resultJS0', resultJS);
			setTask ({...data})
			setRefreshResource(current => current+1)

			}

		)

// ---------------------------
// Function to read the list of available recipes
// ---------------------------

	useEffect (() =>{

		const tt = async () => {
			await loadRecipe ();
			if ('id' in params){
				// await getTask (params.id)
				await loadTask (params.id, user.token);
			}
		}
		tt ();

	},[])

	useEffect( () =>{
		setModalMessage(  loadRecipeMessageError +
								loadTaskMessageError +
								saveTaskMessageError);
	},
	[loadRecipeMessageError, loadTaskMessageError, saveTaskMessageError])

	// ---------------------------
	// Function for getting task in edit mode
	// ---------------------------
	// const getTask = async (id) => {
	// 	const BASE_URL = process.env.REACT_APP_BASE_URL
	// 	const URL = BASE_URL + '/api/task/'+id
	//
	// 	const reqData = {
	// 		method : 'GET',
	// 		headers:{
	// 			'Content-type' : 'application/json',
	// 			'Authorization' : 'Bearer ' + user.token
	// 		},
	// 	}
	//
	// 	try {
	// 		dispatch ( setLoader (true) );
	// 		const result = await fetch(URL, reqData);
	// 		const resultJS = await result.json();
	// 		dispatch ( setLoader (false) );
	// 		if (result.ok){
	// 			setEditMode(EDIT_MODE.EDIT);
	// 			// console.log('DATE :', resultJS.date);
	// 			const tDate = new Date(resultJS.date)
	//
	// 			const year = tDate.getFullYear();
	// 			const month = String(tDate.getMonth() + 1).padStart(2, '0');
	// 			const day = String(tDate.getDate()).padStart(2, '0');
	// 			const formattedDate = `${year}-${month}-${day}`;
	//
	// 			resultJS.date = formattedDate;
	// 			resultJS.user_id = user.userId
	//
	// 			resultJS.taskList.push ({});
	// 			// console.log('resultJS0', resultJS);
	// 			setTask ({...resultJS})
	// 		} else {
	// 			alert(`Error getting list of recipes. Status: ${result.status}. Message: ${resultJS.msg}`)
	// 		}
	// 	} catch (error) {
	// 		dispatch ( setLoader (false) );
	// 		console.log(error);
	// 		alert (`Error getting list of recipes. Message: ${error}`)
	// 	}
	//
	// }


	// ---------------------------
	// Function for saving a new task or update task
	// ---------------------------

	const saveNewTask = async (mode) => {
		// const BASE_URL = process.env.REACT_APP_BASE_URL
		// const URL = BASE_URL + '/api/task'
		//
		// // console.log('No CLEANER DATA to save', task);
		//
		// const data = clearData(task)
		//
		// // console.log('Client DATA to save', data, mode);
		// if (taskDataCheck ( data )) {
		// 	const reqData = {
		// 		method : mode === EDIT_MODE.CREATE ? 'POST' : 'PUT',
		// 		headers:{
		// 			'Content-type' : 'application/json',
		// 			'Authorization' : 'Bearer ' + user.token
		// 		},
		// 		body : JSON.stringify(data),
		// 	}
		//
		// 	try {
		// 		dispatch ( setLoader (true) );
		// 		const result = await fetch(URL, reqData);
		// 		const resultJS = await result.json();
		// 		dispatch ( setLoader (false) );
		// 		// console.log('After saving data:', resultJS);
		// 		if (result.ok){
		// 			// console.log('After saving data:', resultJS);
		// 			setEditMode(EDIT_MODE.EDIT);
		//
		// 			const tDate = new Date(resultJS.date)
		// 			resultJS.date = tDate.toISOString().split('T')[0];
		// 			resultJS.user_id = user.userId
		// 			resultJS.taskList.push ({});
		// 			// console.log('resultJS0', resultJS);
		// 			setTask ({...resultJS})
		//
		// 		} else {
		// 			alert(`Error getting list of recipes. Status: ${result.status}. Message: ${resultJS.msg}`)
		// 		}
		//
		// 	} catch (error) {
		// 		dispatch ( setLoader (false) );
		// 		console.log(error);
		// 		alert (`Error getting list of recipes. Message: ${error}`)
		// 	}
		//
		// }
		const data = clearData(task)

		// console.log('Client DATA to save', data, mode);
		if (taskDataCheck ( data )) {
			saveTask (0,user.token, mode, data);
		}

	}

	// ---------------------------
	// Clearing data before sending it to the server
	// ---------------------------
	const clearData = (task) => {
		// console.log('TASK', task);
		const data = {...task};
		console.log('DATA', data);
		const temp = data.taskList.filter((value) => 'id' in value)
		// console.log('TEMP', temp, data.taskList);
		data.taskList = data.taskList.filter((value) => 'id' in value)

		return data

	}

	// ---------------------------
	// Control data before sending it to the server
	// ---------------------------
	const taskDataCheck = (data) => {
		if ( data.taskList.length === 0 ) {
			alert ('The task must contain at least one recipe')
			return false;
		}
		if (data.taskList.some((value) =>  isNaN(value.quantity) || Number(value.quantity) <=0 )){
			alert ('In the quantity field must be a number greater than zero')
			return false;
		}
		return true;
	}



	// ---------------------------
	// Callback function  called when a recipe is selected
	// ---------------------------
	const choseRecipe = (e, i) => {
		const currentId = e.target.value;
		const currentRecipe = recipeList.filter ((value => value.id === Number(currentId)))

		task.taskList[i].recipeId = currentId;
		task.taskList[i].recipeName = currentRecipe[0].name;
		task.taskList[i].unit_name = currentRecipe[0].unit_name; 	
		task.taskList[i].quantityInRecipe = currentRecipe[0].finish_quantity	
		if (!('id' in task.taskList[i])){
			task.taskList[i].id=0;
		}
		if ( task.taskList.every (value => ('id' in value) ) ){
			task.taskList.push({...emptyTask});
		}
		// console.log('On change', task);
		setTask({...task})
	}

	// ---------------------------
	// Callback function called when the quantity to be produced changes
	// ---------------------------
	const changeQuantity = (e, i) =>{
		const currentQuantity = e.target.value;
		if ( !isNaN(currentQuantity) ){
			task.taskList[i].quantity = currentQuantity;
			task.taskList[i].totalQuantity = Number ( currentQuantity ) * Number ( task.taskList[i].quantityInRecipe )
			setTask({...task}); 
		}

	}

	// ---------------------------
	// Callback function called to remove recipe from task
	// ---------------------------
	const removeRecipe = (e, i) => {
		task.taskList = task.taskList.filter ((value,index) => index !== i );
		setTask({...task}); 
	}

	const fieldsList = [
		{
			fieldType: tableFieldType.INDEX_FIELD,
			fieldName : 'No',
			justify : 'center',
			width : 1,
			fieldNameInList: 'i'
		},
		{
			fieldType: tableFieldType.SELECT_FIELD,
			fieldName : 'recipe',
			justify : 'start',
			width : 4,
			fieldNameInList: 'recipeId',
			selectItemList: recipeList,
			action: choseRecipe,
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'quan.',
			justify : 'center',
			width : 2,
			fieldNameInList: 'quantityInRecipe'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'unit',
			justify : 'center',
			width : 1,
			fieldNameInList: 'unit_name'
		},
		{
			fieldType: tableFieldType.ENTER_FIELD,
			fieldName : 'repeat',
			justify : 'center',
			width : '2',
			fieldNameInList: 'quantity',
			action: changeQuantity,
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'total',
			justify : 'center',
			width : 2,
			fieldNameInList: 'totalQuantity',
		},
		{
			fieldType: tableFieldType.ACTION_FIELD,
			actionType : tableActionType.REMOVE,
			action : removeRecipe,
		}
	]

	const clearAllMessages = () => {
		if (loadRecipeMessageError) {
			loadRecipeClearMessageError();
			navigate('/');
		}

		if (loadTaskMessageError) {
			loadTaskClearMessageError();
			navigate('/');
		}
		if (saveTaskMessageError){
			saveTaskClearMessageError();
		}
		setModalMessage('');
	}

	return (

		<div className="container">
			{modalMessage &&
				<ModalWindow title={'Error'} body={modalMessage} closeAction={clearAllMessages}/>}
			{editMode === EDIT_MODE.CREATE ?
				<Breadcrumbs>
					CREATE daily task
				</Breadcrumbs>
				:
				editMode === EDIT_MODE.EDIT ?
					<Breadcrumbs>
						EDIT daily task
					</Breadcrumbs>
					:
					<Breadcrumbs>
						VIEW daily task
					</Breadcrumbs>
			}
			<div className='row'>
				<WhitePageSection>
					<DateSection>
						<DateInput task={task} setTask={setTask}  />
					</DateSection>
					<TableSection>
						<BaseTable fieldsList={fieldsList} elementsList={task.taskList} />
					</TableSection>
					<ButtonSection className='text-end'>
						{editMode === EDIT_MODE.CREATE ?
							<MyButton className='btn btn-outline-danger m-3' onClick={ () => saveNewTask (EDIT_MODE.CREATE) } >Save</MyButton>
							:
							editMode === EDIT_MODE.EDIT ?
								<MyButton className='btn btn-outline-danger m-3' onClick={ () => saveNewTask (EDIT_MODE.EDIT) } >Update</MyButton>
								:
								<h4>Task is in work. View mode</h4>
						}
						<MyButton className='btn btn-outline-danger m-3' onClick={ () => navigate(`/task/list`) } >Close</MyButton>
					</ButtonSection>
				</WhitePageSection>
				<WhitePageSection>
					<h6>Resources</h6>
					{!(editMode === EDIT_MODE.CREATE) ?
						<ResourcesUsed id={task.id} refresh={refreshResource}/>
						:
						''
					}
				</WhitePageSection>
			</div>
		</div>
	)
}

export default CreateTask