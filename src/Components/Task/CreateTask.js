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
import TaskValidation from "./Validation/taskValidation";


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


const CreateTask = () => {

	// const [taskList, setTaskList] = useState( [ {...emptyTask} ] );

	const [recipeList, setRecipeList] = useState([{}]);

	const [editMode, setEditMode] = useState (EDIT_MODE.CREATE)

	const [modalMessage, setModalMessage] = useState('');

	const [refreshResource, setRefreshResource] = useState(0);

	const [resource, setResource] = useState(
		{
			ingredients:[{}],
			equipments :[{}],
		}
	);

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

	const [loadResource, loadResourceErrorMessage, loadResourceClearErrorMessage] =
		useFetching( async (id, token) => {
			const data = await TaskServiceAPI.getResource(id, token);
			setResource( data );
			}
		)

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
// ---------------------------
// Function to read the list of available recipes
// ---------------------------

	useEffect (() =>{

		const tt = async () => {
			await loadRecipe ();
			if ('id' in params){
				// await getTask (params.id)
				await loadTask (params.id, user.token);
				await loadResource (params.id, user.token);
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
// Function for saving a new task or update task
// ---------------------------

	const saveNewTask = async (mode) => {
		const data = TaskValidation.clearData(task)

		// console.log('Client DATA to save', data, mode);
		if (TaskValidation.taskDataCheck ( data, setModalMessage )) {
			await saveTask (0,user.token, mode, data);
			await loadResource (task.id, user.token);
		}

	}


// ---------------------------
// Callback function  called when a recipe is selected
// ---------------------------
	function choseRecipe (e, i) {
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
	function changeQuantity (e, i) {
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
	function removeRecipe (e, i) {
		task.taskList = task.taskList.filter ((value,index) => index !== i );
		setTask({...task}); 
	}



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
					<ButtonSection className='flex-row d-flex justify-content-end mt-3 mb-3'>
						{editMode === EDIT_MODE.CREATE ?
							<MyButton className='me-3' onClick={ () => saveNewTask (EDIT_MODE.CREATE) } >Save</MyButton>
							:
							editMode === EDIT_MODE.EDIT ?
								<MyButton className='me-3' onClick={ () => saveNewTask (EDIT_MODE.EDIT) } >Update</MyButton>
								:
								<h4>Task is in work. View mode</h4>
						}
						<MyButton className='ms-3' onClick={ () => navigate(`/task/list`) } >Close</MyButton>
					</ButtonSection>
				</WhitePageSection>
				<WhitePageSection>
					<h6>Resources</h6>
					{!(editMode === EDIT_MODE.CREATE) ?
						// <ResourcesUsed id={task.id} refresh={refreshResource}/>
						<ResourcesUsed resource={resource}/>
						:
						''
					}
				</WhitePageSection>
			</div>
		</div>
	)
}

export default CreateTask