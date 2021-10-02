const express = require('express');
const cors = require('cors');
const { v4: uuidv4 }= require('uuid');

const fs = require('fs');
const path = require('path'); 
const dbPath= path.join( __dirname , './db/main.json' );


const app = express();

app.set('PORT', process.env.PORT || '3333');

app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );
app.use( cors() );

//app.get('/', (req,res) => res.send('welcome to Express JS') );

app.post('/api/addOne', (req,res) =>{
  let status= false;
  try {
    const { title , description }= req.body;

    const newItem= {
      noteId: uuidv4(),
      title,
      description
    }
  
    let db= fs.readFileSync( dbPath , { encoding: "utf-8" } );
    db= db.length > 0 ? JSON.parse(db) : [];
  
    db.push(newItem);
  
    db= JSON.stringify(db);
    fs.writeFileSync( dbPath , db , { encoding: "utf-8" } );

    status= true;
  } catch (error) {
    console.log(error);
  }

  const response= { 
    status,
    message: status ? "save item successfully" : "error while saved file"
  }

  res.json(response);
});

app.get('/api/getAll', (req,res) =>{
  let status= false;
  let data= null;
  try {  
    data= fs.readFileSync( dbPath , { encoding: "utf-8" } );
    data= JSON.parse(data);
  
    status= true;
  } catch (error) {
    
  }

  const response= { 
    status,
    data: data,
    message: status ? "get all items successfully" : "error"
  }
  
  res.json(response);
});

app.put('/api/editOne/:id', (req,res) =>{
  let status= false;
  const { title , description }= req.body;
  const { id }= req.params;
  try {

    let db= fs.readFileSync( dbPath , { encoding: "utf-8" } );

    db= JSON.parse(db).map( note => {
      let newNote= note;
      if( note.noteId == id ){
        note.title = title;
        note.description = description;
      }
      return newNote;
    });

    db= JSON.stringify(db);
    fs.writeFileSync( dbPath , db , { encoding: "utf-8" } );

    status= true;
  } catch (error) {
    
  }

  const response= { 
    status,
    message: status ? `Edit note with id ${ id } successfully` : "error"
  }

  res.json(response);
});

app.delete('/api/delOne/:id', (req,res) =>{
  let status= false;
  const { id }= req.params;
  try {
    
    let db= fs.readFileSync( dbPath , { encoding: "utf-8" } );

    db= JSON.parse(db).filter( note => {
      let newNote= note;
      if( note.noteId == id ) return;
      return newNote;
    });

    db= JSON.stringify(db);
    fs.writeFileSync( dbPath , db , { encoding: "utf-8" } );

    status= true;
  } catch (error) {
    console.log(error);
  }

  const response= { 
    status,
    message: status ? `Delete note with id ${ id } successfully` : "error"
  }

  res.json(response);
});

app.use( express.static( path.join(__dirname , '../src/') ) );

app.listen( app.get('PORT') , () => console.log(`server listen on http://localhost:${ app.get('PORT') }`) );