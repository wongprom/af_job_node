import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';
import { useState, useMemo } from 'react';

const SearchContainer = () => {
  const [localSearch, setLocalSearch] = useState('');
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

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

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalSearch('');
    clearFilters();
  };

  return (
    <Wrapper>
      <h4>search form</h4>
      <div className="form-center">
        <FormRow
          type="text"
          name="search"
          value={localSearch}
          onChange={optimizedDebounce}
        />
        {/* search by status */}
        <FormRowSelect
          labelText="job status"
          name="searchStatus"
          value={searchStatus}
          handleChange={handleSearch}
          list={['all', ...statusOptions]}
        />
        {/* search by type */}

        <FormRowSelect
          labelText="job type"
          name="searchType"
          value={searchType}
          handleChange={handleSearch}
          list={['all', ...jobTypeOptions]}
        />
        {/* sort */}

        <FormRowSelect
          name="sort"
          value={sort}
          handleChange={handleSearch}
          list={sortOptions}
        />
        <button
          className="btn btn-block btn-danger"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          clear filters
        </button>
      </div>
    </Wrapper>
  );
};
export default SearchContainer;
