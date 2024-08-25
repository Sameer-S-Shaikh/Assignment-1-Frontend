import React from 'react';

function SectionList({ section, sectionClasses, handleToggleClass }) {
  const classes = ["innerNone", "innerBasic", "innerAdvance", "innerComplex"];

  return (
    <div>
      <div className='d-flex'>
        <b>{section.label}</b>
        <span className='bi bi-info-circle m-1'></span>
      </div>
      {sectionClasses && sectionClasses.map((classValue, index) => (
        <div key={`${section.name}-${index}`} className='d-flex justify-content-between bg-light outer mt-3'>
          <span 
            className='btn' 
            onClick={() => handleToggleClass(section.name, index, -1)} 
            disabled={classValue === 'innerNone'}
          >
            -
          </span>
          <div className={`bg ${classValue}`}>
            {classValue ? classValue.replace('inner', '') : ''}
          </div>
          <span 
            className='btn' 
            onClick={() => handleToggleClass(section.name, index, 1)} 
            disabled={classValue === 'innerComplex'}
          >
            +
          </span>
        </div>
      ))}
    </div>
  );
}

export default SectionList;
