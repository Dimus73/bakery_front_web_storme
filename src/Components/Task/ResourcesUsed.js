import { useState, useEffect } from "react";
import {useDispatch , useSelector } from "react-redux";
import { setLoader } from "../../redux/action";
import { useNavigate } from "react-router-dom";
import { setIngredientsListToMove } from "../../redux/action";
import {tableFieldType} from "../UI/Table/tableFieldType";
import BaseTable from "../UI/Table/BaseTable";
import TableSection from "./UI/TableSection";
import equipment from "../Catalog/Equipment";
import MyButton from "../UI/Button/MyButton";


const ResourcesUsed = ({id,refresh}) => {
	const [resource, setResource] = useState(
		{
			ingredients:[{}],
			equipments :[{}],
		}
		);
	const user = useSelector ((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// console.log('Resource props.id=>', props.id);
	// const id = props.id;
	// const ref
	// const id=93;

	const getResource = async (id) => { 
		const BASE_URL = process.env.REACT_APP_BASE_URL
		const URL = BASE_URL + '/api/task/resource/' + id
		
		const reqData = {
			method : 'GET',
			headers:{
				'Content-type' : 'application/json',
				'Authorization' : 'Bearer ' + user.token
			},
		}

		try {
			dispatch ( setLoader (true) );
			const data = await fetch(URL, reqData);
			const dataJS = await data.json();
			dispatch ( setLoader (false) );
			console.log('Resource from DB=>', data, dataJS);
			if (data.ok) {
				setResource (dataJS);
			} else {
				alert(`Error getting list of recipes. Status: ${data.status}. Message: ${dataJS.msg}`)
			}
		} catch (error) {
			dispatch ( setLoader (false) );
			console.log(error);
			alert (`Error getting list of recipes. Message: ${error}`)
		}
	}

	useEffect (() =>{
		const t = async () => {
			getResource(id);
		}
		t ();
	},[])

	useEffect (() =>{
		const t = async () => {
			getResource(id);
		}
		t ();
	},[id])


	// **************** Call Pushes List
	const callPushesList = () => {
		dispatch (setIngredientsListToMove(resource.ingredients));
		// console.log('Weth send to dispatch=>',resource.ingredients );
		navigate ('/warehouse/purchase');
	}

	const callSpanList = () => {
		dispatch (setIngredientsListToMove(resource.ingredients));
		// console.log('Weth send to dispatch=>',resource.ingredients );
		navigate ('/warehouse/span');
	}

	const fieldsIngredientsList = [
		{
			fieldType: tableFieldType.INDEX_FIELD,
			fieldName : 'n',
			justify : 'center',
			width : 1,
			fieldNameInList: 'i'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'Equipment',
			justify : 'start',
			width : 7,
			fieldNameInList: 'resource'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'stock',
			justify : 'center',
			width : 1,
			fieldNameInList: 'quantity_on_stock'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'quantity',
			justify : 'center',
			width : 2,
			fieldNameInList: 'quantity'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'unit',
			justify : 'center',
			width : 2,
			fieldNameInList: 'unit_name'
		},
	]


	const fieldsEquipmentList = [
		{
			fieldType: tableFieldType.INDEX_FIELD,
			fieldName : 'n',
			justify : 'center',
			width : 1,
			fieldNameInList: 'i'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'Equipment',
			justify : 'start',
			width : 7,
			fieldNameInList: 'resource'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'quantity',
			justify : 'center',
			width : 2,
			fieldNameInList: 'quantity'
		},
		{
			fieldType: tableFieldType.TEXT_FIELD,
			fieldName : 'unit',
			justify : 'center',
			width : 2,
			fieldNameInList: 'unit_name'
		},

	]
	return (
		<div className="container pt-3">
			{`Refresh ${refresh}`}
			<div className="row">
				<div className="row">
					<TableSection>
						<BaseTable fieldsList={fieldsIngredientsList} elementsList={resource.ingredients}/>
					</TableSection>
				</div>
				<div className="row ">
				  <div className="col text-start">
						<MyButton className="btn btn-outline-danger" onClick={ callSpanList }>To production</MyButton>
					</div>
					<div className="col text-end">
						<MyButton className="btn btn-outline-danger" onClick={ callPushesList }>Purchase</MyButton>
					</div>
				</div>

				<div className="row"> 
					<TableSection>
						<BaseTable fieldsList={fieldsEquipmentList} elementsList={resource.equipments}/>
					</TableSection>
				</div>

			</div>
		</div>
	)
}

const TableRows = (props) => {
	return(
		<tr key={props.i}>
			<td className='col-1 text-center'>{props.i+1}</td>
			<td className='col-1 text-start'>{ props.item.resource }</td>
			{props.resource === 'I' ? <td className='col-1 text-center'>{ props.item.quantity_on_stock }</td> : ''}
			<td className='col-1 text-center'>{ props.item.quantity }</td>
			<td className='col-1 text-center'>{ props.item.unit_name }</td>
		</tr>
	)
}

export default ResourcesUsed

