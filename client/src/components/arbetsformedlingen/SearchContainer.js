import { useState, useMemo } from 'react';
import { FormRow, FormRowSelect } from '../index.js';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/SearchContainer';

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
      <h4>search form Af</h4>
      <div className="form-center">
        <FormRow
          type="text"
          name="searchArbetsformedlingen"
          value={localSearch}
          onChange={optimizedDebounce}
        />
      </div>
    </Wrapper>
  );
};
export default SearchContainer;
