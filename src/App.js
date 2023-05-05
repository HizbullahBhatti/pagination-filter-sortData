import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBTable, MDBTableHead, MDBTableBody, MDBRow, MDBCol, MDBContainer, MDBBtn, MDBBtnGroup, MDBPagination, MDBPaginationItem, MDBPaginationLink    } from 'mdb-react-ui-kit'

const App = ()=> {

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [query, setQuery] = useState("");
  const [sortValue, setSortValue] = useState("");
  const[currentPage, setCurrentPage] = useState(0);
  const[pageLimit] = useState(4);


  const sortOptions = ['name', 'email', 'phone', 'address']


  const formCSS = {
    margin : "auto",
    marginTop:"20px",
    padding : "15px",
    maxWidth:"400px",
    alignContent:"center",
  }


  useEffect(()=>{
    loadData(0,pageLimit,0 );
  },[])

  const loadData = async (start,end,increase)=>{
    const reqData = await fetch(`http://localhost:2000/users?_start=${start}&_end=${end}`);
    const resData = await reqData.json();
    setData(resData);
    setCurrentPage(currentPage+increase)
    setFilterData(resData)
  };

  console.log(data);

  const handleSearch = async(event)=>{
    const getSearch = event.target.value;
    
    if(getSearch.length>0){
      const searchData = data.filter((item)=> item.name.toLowerCase().includes(getSearch.toLowerCase()));
      setData(searchData);
    }
    else{
      setData(filterData);
    } 
    setQuery(getSearch);
  }

  const handleSort = async(e)=>{
    let value = e.target.value;
    setSortValue(value)
    return await axios.get(`http://localhost:2000/users?_sort=${value}&_order=asc`)
    .then((response) =>{
      setData(response.data);
      console.log(value); 
    })
    .catch(error => console.log(error));
  }


  const handleFilter = async(value)=>{
    return await axios.get(`http://localhost:2000/users?status=${value}`)
    .then((response) =>{
      setData(response.data);
    })
    .catch(error => console.log(error));
  }

  const renderPagination = ()=>{
    if(currentPage===0){
      return(
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={()=>loadData(4,8,1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
    else if(currentPage < pageLimit - 1 && data.length === pageLimit){
      return(
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationItem>
            <MDBBtn onClick={()=>loadData((currentPage-1)* 4 , currentPage*4 , -1)}>Prev</MDBBtn>
            </MDBPaginationItem>
            
            <MDBPaginationItem>
            <MDBPaginationLink>{ currentPage + 1 }</MDBPaginationLink>
            </MDBPaginationItem>
            
          </MDBPaginationItem>
          <MDBPaginationItem>
          <MDBBtn onClick={()=>loadData((currentPage+1)*4,(currentPage+2)*4,1)}>Next</MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
    else{
      return(
        <MDBPagination className='mb-0'>
          
          <MDBPaginationItem>
            <MDBBtn onClick={()=>loadData(4,8,-1)}>Prev</MDBBtn>
          </MDBPaginationItem>

          <MDBPaginationItem>
            <MDBPaginationLink>{currentPage + 1 }</MDBPaginationLink>
          </MDBPaginationItem>

        </MDBPagination>
      )
    }
  }


  const handleReset = (e)=>{
    loadData();
  }

  return (
    <MDBContainer>
      <form style={formCSS}
      className='d-flex input-group w-auto'
      >

        <input 
        type='text' 
        value={query} 
        className='form-control' 
        placeholder='Search' 
        onChange={(e)=>handleSearch(e)} 
        /> 
          <MDBBtn className='mx-2' color='danger' onClick={()=>handleReset()}>Reset</MDBBtn>
        



      </form>
      <div style={{marginTop:"20px"}}>
        <h2 className='text-center'>Filtering Data</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'>No.</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Address</th>
                  <th scope='col'>Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className='align-center mb-0'>
                  <tr>
                    <td colSpan={8} className='text-center mb-0'>
                      No Data Found
                    </td>
                  </tr>
                </MDBTableBody>
              ):(
                data.map((item, index)=>(
                  <MDBTableBody key={index}>
                    <tr>
                      <th scope='row'>{item.id}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div style={formCSS}>{renderPagination()}</div>
      </div>
      <MDBRow>
        <MDBCol size='8'>
          <h5>Sort By:</h5>
          <select style={{width:'50%' , borderRadius:'10px', height:'35px', marginBottom:'20px'}}
          onChange={handleSort}
          value={sortValue}
          >
            <option>Select Value</option>
            {sortOptions.map((item,index)=>{
              return <option key={index} value={item}>{item}</option>
            })}
          </select>
        </MDBCol>
        <MDBCol size='4'>
          <h5>Filter by Status</h5>
          <MDBBtnGroup>
            <MDBBtn color='success' onClick={()=>handleFilter('active')}>Active</MDBBtn>
            <MDBBtn color='danger' style={{marginLeft:'2px'}} onClick={()=>handleFilter('Inactive')}>Inactive</MDBBtn> 
          </MDBBtnGroup>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
