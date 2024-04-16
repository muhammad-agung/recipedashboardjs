import Pagination from 'react-bootstrap/Pagination';
import './MobilePagination.css'

const MobilePagination = ({ pageNumbers, currentPage, handleChange }) => {
    let items = [];
  
    for (let number = 1; number <= pageNumbers.length; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handleChange(null, number)}
          className={number === currentPage ? 'active-page' : 'pagination-item'}
        >
          {number}
        </Pagination.Item>
      );
    }
  
    return (
      <div className="pagination-container" >
        <Pagination>{items}</Pagination>
      </div>
    );
  };
  
  export default MobilePagination;