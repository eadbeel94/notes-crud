console.log('main frontend init');
const d= document;
const backURL= "http://localhost:3333/api";

const modifyOneNote= ()=>{
  console.log('this is the addOne function');
  const form = d.querySelector('form');

  form.onsubmit= async (ev)=>{
    ev.preventDefault();

    const isNewNote= ev.submitter.matches('button[data-type="save"]');
    const isEditNote= ev.submitter.matches('button[data-type="update"]');

    const note= {
      title: ev.target[0].value,
      description: ev.target[1].value
    }

    if( isNewNote ){
      const data= await fetch(`${ backURL }/addOne`, {
        method: 'POST',
        body: JSON.stringify(note),
        headers:{ 'Content-Type': 'application/json'  } 
      });
      const { status }= await data.json();
  
      status && setTimeout(() => location.reload(), 1000);
    }else if(isEditNote){

      const id= ev.submitter.dataset.id;

      const data= await fetch(`${ backURL }/editOne/${ id }`, {
        method: 'PUT',
        body: JSON.stringify(note),
        headers:{ 'Content-Type': 'application/json'  } 
      });
      const { status }= await data.json();
      status && setTimeout(() => location.reload(), 1000);
    }

    return false;
  };

};

const showAllNotes= async ()=>{
  console.log('this is the showAllNotes function');

  const spaceCards= d.getElementById('allcards');

  const info= await fetch(`${ backURL }/getAll`);
  const { status , data , message }= await info.json();

  let cards= "";
  data.forEach( note => {
    cards+= `
      <section data-id="${ note.noteId }" class="col-6 p-1">
        <div class="card" >
          <div class="card-header text-center">
            <h5 class="card-title">${ note.title }</h5>
          </div>
          <div class="card-body">
            <p class="card-text">${ note.description }</p>
          </div>
          <div class="card-footer">
            <div class="btn btn-group w-100">
              <button type="button" data-type="edit" data-id="${ note.noteId }" class="btn btn-info">
                Edit
              </button>
              <button type="button" data-type="erase" data-id="${ note.noteId }" class="btn btn-danger">
                Erase
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  });
  spaceCards.innerHTML+= cards;
};

const watchAllNotes= async ()=>{
  console.log('this is the watchAllNotes function');

  const spaceCards= d.getElementById('allcards');
  
  spaceCards.onclick= async (ev) =>{
    const isEdit= ev.target.matches(`button[data-type="edit"]`);
    const isErase= ev.target.matches(`button[data-type="erase"]`);
    const id= ev.target.dataset.id;

    if(isEdit){
      const title= d.querySelector(`[data-id="${id}"] h5`).textContent;
      const description= d.querySelector(`[data-id="${id}"] p`).textContent;

      d.querySelector('form input').value= title;
      d.querySelector('form textarea').value= description;

      d.querySelector('form button[data-type="save"]').classList.add('d-none');
      d.querySelector('form button[data-type="update"]').classList.remove('d-none');
      d.querySelector('form button[data-type="update"]').dataset.id= id;
    }else if( isErase ){
      const data= await fetch(`${ backURL }/delOne/${ id }`, { method: 'DELETE' });
      const { status }= await data.json();
      status && setTimeout(() => location.reload(), 1000);
    }

  }
  
};

const main= ()=>{
  console.log('this is the main function');

  showAllNotes();
  modifyOneNote();
  watchAllNotes();
};

window.onload= main;