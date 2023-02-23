import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { useAppContext } from '../../context/appContext';
import Wrapper from '../../assets/wrappers/PageBtnContainer';
import { useLocation } from 'react-router-dom';

const PageBtnContainer = () => {
  const { numOfPagesArbetsformedlingen, pageArbetsformedlingen, changePage } =
    useAppContext();

  const location = useLocation();
  const isPathNameIncludesArbetsformedlingen =
    location.pathname.includes('arbetsformedlingen');

  const pages = Array.from(
    { length: numOfPagesArbetsformedlingen },
    (_, index) => {
      return index + 1;
    }
  );

  const prevPage = () => {
    let newPage = pageArbetsformedlingen - 1;
    if (newPage < 1) {
      newPage = numOfPagesArbetsformedlingen;
    }
    changePage(newPage, isPathNameIncludesArbetsformedlingen);
  };

  const nextPage = () => {
    let newPage = pageArbetsformedlingen + 1;
    if (newPage > numOfPagesArbetsformedlingen) {
      newPage = 1;
    }
    changePage(newPage, isPathNameIncludesArbetsformedlingen);
  };

  return (
    <Wrapper>
      <button className="prev-btn" onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className="btn-container">
        {pages.map((pageNumber) => {
          return (
            <button
              key={pageNumber}
              type="button"
              className={
                pageNumber === pageArbetsformedlingen
                  ? 'pageBtn active'
                  : 'pageBtn'
              }
              onClick={() =>
                changePage(pageNumber, isPathNameIncludesArbetsformedlingen)
              }
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button className="next-btn" onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};
export default PageBtnContainer;
