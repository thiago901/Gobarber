import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  padding-bottom: 100px;

  header {
    display: flex;
    align-self: center;
    align-items: center;
    strong {
      color: #fff;
      font-size: 24px;
      margin: 0 15px;
    }
    button {
      background: none;
      border: 0;
    }
  }
  ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 15px;
    margin: 30px 0 0 0;
  }
`;

export const Time = styled.li`
  padding: 20px;
  background: #fff;
  border-radius: 4px;
  opacity: ${p => (p.past ? '0.6' : '1')};
  strong {
    display: block;
    color: ${props => (props.available ? '#999' : '#7159c1')};
    font-size: 20px;
    font-weight: normal;
  }
  span {
    display: block;
    color: ${props => (props.available ? '#999' : '#666')};
    margin: 3px 0 0 0;
  }
`;
