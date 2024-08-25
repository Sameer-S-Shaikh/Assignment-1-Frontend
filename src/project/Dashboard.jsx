import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import PageList from './PageList';
import SectionList from './SectionList';
import CostList from './CostList';
import SuccessMessage from './SuccessMessage';
import './dashbord.css';

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
    // ...same code as before
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
      <Header 
        data={data} 
        sections={sections} 
        totalPrice={totalPrice} 
        handleAddPage={handleAddPage} 
      />
      <hr />
      <main className='d-grid row'>
        <PageList 
          data={data} 
        />
        {sections.map(section => (
          <SectionList 
            key={section.name} 
            section={section} 
            sectionClasses={sectionClasses[section.name]} 
            handleToggleClass={handleToggleClass} 
          />
        ))}
        <CostList 
          data={data} 
          handleDeletePage={handleDeletePage} 
        />
      </main>
      {successMessage && <SuccessMessage message={successMessage} />}
    </div>
  );
}

export default Dashbord;
