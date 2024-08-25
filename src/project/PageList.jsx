import React from 'react';

function PageList({ data }) {
  return (
    <div className='col-3'>
      <ol className='me-4'>
        <div className='d-flex'>
          <b>Pages </b>
          <span className='bi bi-info-circle m-1'></span>
        </div>
        {data.map((design) => (
          <li className='bar' key={design._id}>{design.pname}</li>
        ))}
      </ol>
    </div>
  );
}

export default PageList;
