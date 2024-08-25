
import React from 'react';

function Header({ data, sections, totalPrice, handleAddPage }) {
  return (
    <header className="d-flex justify-content-between m-5">
      <div>
        <span className="head">{data.length}</span>
        <span> Pages</span>
        <button className='btn' onClick={handleAddPage}>Add Page</button>
      </div>
      {sections.map(section => (
        <div key={section.name}>
          <span><b>${section.price}</b><br />{section.label}</span>
        </div>
      ))}
      <div>
        <span><b>Sub Total</b></span><br />
        <span className='head'>${totalPrice}</span>
      </div>
    </header>
  );
}

export default Header;
