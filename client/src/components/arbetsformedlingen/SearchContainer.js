import { useState, useMemo } from 'react';
import { FormRow, FormRowSelect } from '../index.js';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/SearchContainer';
import Header from '../../assets/wrappers/Header';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');
  const { handleChange } = useAppContext();

  const debounce = () => {
    let timeoutID;
    return (e) => {
      setLocalSearch(e.target.value);
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        handleChange({ name: e.target.name, value: e.target.value });
      }, 500);
    };
  };

  const optimizedDebounce = useMemo(() => debounce(), []);

  return (
    <Wrapper>
      <Header>
        <p className="title">Platsbanken</p>
        <p className="sub-title">Available React jobs for the entire Sweden</p>
      </Header>
      <div className="form-center">
        <FormRow
          type="text"
          labelText="Search for one or more words"
          name="searchArbetsformedlingen"
          value={localSearch}
          onChange={optimizedDebounce}
        />
      </div>
    </Wrapper>
  );
};
export default SearchContainer;
