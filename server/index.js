const express = require('express');
const app = express();
const cors = require('cors');
const data = require('./dummyData.json');
app.use(cors());

app.get('/users', (req, res) => {
  
  const { _sort, _order } = req.query;
  const{status} = req.query;
  const{_start, _end} = req.query;
  const {q}= req.query
  
  // Check if _sort and _order parameters are provided in the query string
  if (_sort && _order) {
    // Sort the data based on the provided _sort parameter
    const sortedData = data.sort((a, b) => {
      if (a[_sort] < b[_sort]) {
        return -1;
      }
      if (a[_sort] > b[_sort]) {
        return 1;
      }
      return 0;
    });

    // Order the results in ascending or descending order based on the _order parameter
    const orderedData = _order === 'desc' ? sortedData.reverse() : sortedData;

    // Send the ordered and sorted data as a response
    res.send(orderedData);
  }
  
  if(status){
    const statusData = data.filter((item)=> item.status === status);
    res.send(statusData);
  }

  if(_start && _end){
    const start = parseInt(req.query._start);
    const end = parseInt(req.query._end);
    const rangeData = data.slice(start, end);
    res.send(rangeData);
  }

  if(q){
    filteredData = data.filter((user) => {user.name.toLowerCase().includes(query.toLowerCase())});
    res.send(filteredData);
  }
  
  
  

  
  
  else {
    // Send the unsorted data if _sort and _order parameters are not provided
    res.send(data);
  }


   
  });

  app.listen(2000, () => {
    console.log('Server is listening on port 2000');
  });
  