import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dashbord.css';

const classes = ["innerNone", "innerBasic", "innerAdvance", "innerComplex"];

const sections = [
  { name: 'design', label: 'Design', price: 300 },
  { name: 'interaction', label: 'Interactions & Animations', price: 200 },
  { name: 'animation', label: 'Animation', price: 300 },
];

function Dashbord() {
  const [sectionClasses, setSectionClasses] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:3000/api/design');
        const fetchedData = response.data;

        setData(fetchedData);
        const initialSectionState = Object.fromEntries(
          sections.map(section => [
            section.name,
            fetchedData.length > 0 ? fetchedData.map(page => page.classes?.[section.name] || 'innerNone') : []
          ])
        );

        setSectionClasses(initialSectionState);
        calculateTotalPrice(fetchedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateTotalPrice = (currentData) => {
    let total = 0;
    currentData.forEach(page => {
      total += page.cost || 0;
    });
    setTotalPrice(total);
  };

  const handleToggleClass = async (section, index, direction) => {
    
    const pageId = data[index]?._id;
    if (!pageId) return; 

    const currentCost = data[index]?.cost || 0;
    const currentClasses = [...sectionClasses[section]];
    const currentIndex = classes.indexOf(currentClasses[index]);

    if ((direction === 1 && currentClasses[index] === 'innerComplex') || 
        (direction === -1 && currentClasses[index] === 'innerNone')) {
      return;
    }

    const newIndex = (currentIndex + direction + classes.length) % classes.length;
    const newClass = classes[newIndex];

    const updatedSectionClasses = {
      ...sectionClasses,
      [section]: currentClasses.map((cls, i) => i === index ? newClass : cls)
    };

    const priceChange = sections.find(sec => sec.name === section)?.price * direction || 0;
    const newCost = Math.max(currentCost + priceChange, 0);

    const updatedData = data.map((page, i) => 
      i === index ? { ...page, cost: newCost, classes: { ...page.classes, [section]: newClass } } : page
    );

    setSectionClasses(updatedSectionClasses);
    setData(updatedData);
    calculateTotalPrice(updatedData);

    try {
      await axios.put(`http://127.0.0.1:3000/api/design/${pageId}`, { 
        cost: newCost,
        classes: { ...data[index].classes, [section]: newClass } 
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddPage = async () => {
    const newPageName = prompt('Enter the name of the new page:');
    if (!newPageName) {
        alert('Please provide a page name');
        return;
    }

    try {
        const response = await axios.post('http://127.0.0.1:3000/api/design', {
            pname: newPageName,
            cost: 0,
            classes: sections.reduce((acc, section) => ({ ...acc, [section.name]: 'innerNone' }), {})
        });
        const newPage = response.data;

        setData(prevData => [...prevData, newPage]);

        setSectionClasses(prevClasses => {
            const updatedClasses = { ...prevClasses };
            sections.forEach(section => {
                updatedClasses[section.name] = [...(prevClasses[section.name] || []), 'innerNone'];
            });
            return updatedClasses;
        });

        setSuccessMessage('Page added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);

        calculateTotalPrice([...data, newPage]);

    } catch (err) {
        setError(err.message);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!window.confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:3000/api/design/${pageId}`);

      const updatedData = data.filter(page => page._id !== pageId);
      setData(updatedData);

      setSectionClasses(prevClasses => {
        const updatedClasses = { ...prevClasses };
        sections.forEach(section => {
          updatedClasses[section.name] = updatedClasses[section.name].filter((_, i) => data[i]?._id !== pageId);
        });
        return updatedClasses;
      });

      calculateTotalPrice(updatedData);
      setSuccessMessage('Page deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='background'>
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
      <hr />
    
      <main className='d-grid row'>
        <div className='col-3'>
          <ol className='me-4'>
            <div className='d-flex'>
              <b>Pages </b>
              <span className='bi bi-info-circle m-1'></span>
            </div>
            {
              data.map((design) =>
                <li className='bar' key={design._id}>{design.pname}</li>
              )
            }
          </ol>
        </div>

        {sections.map(section => (
          <div key={section.name}>
            <div className='d-flex'>
              <b>{section.label}</b>
              <span className='bi bi-info-circle m-1'></span>
            </div>
            {sectionClasses[section.name] && sectionClasses[section.name].map((classValue, index) => (
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
        ))}

        <div className='prise'>
          <div className='d-flex'>
            <b>Cost</b>
            <span className='bi bi-info-circle m-1'></span>
          </div>
          <div className='d-grid '>
            {
              data.map((design) =>
                <div key={design._id}>
                  <div className='barr'>$ {design.cost} <span className='bi bi-trash btn' onClick={() => handleDeletePage(design._id)}>Delete</span></div>
                </div>
              )
            }
          </div>
        </div>
      </main>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
}

export default Dashbord;
