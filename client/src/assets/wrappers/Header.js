import styled from 'styled-components';

const Header = styled.div`
  padding: 15px 25px 30px;
  width: 100%;
  background-color: #00005a;
  color: white;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin-bottom: 20px;

  .title {
    all: unset;
    font-size: 2em;
    font-weight: bold;
  }

  .sub-title {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.5em;
    font-weight: normal;
    margin-top: 30px;
  }

  h5 {
    font-size: 1em;
    font-weight: normal;
    margin-top: 20px;
  }
  @media (min-width: 768px) {
    width: 510px;
    .title {
      font-size: 3em;
    }
  }
`;
export default Header;
