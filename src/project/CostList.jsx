
import React from 'react';

function CostList({ data, handleDeletePage }) {
  return (
    <div className='prise'>
      <div className='d-flex'>
        <b>Cost</b>
        <span className='bi bi-info-circle m-1'></span>
      </div>
      <div className='d-grid '>
        {data.map((design) => (
          <div key={design._id}>
            <div className='barr'>$ {design.cost} <span className='bi bi-trash btn' onClick={() => handleDeletePage(design._id)}>Delete</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CostList;
