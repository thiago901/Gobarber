import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;
export const Content = styled.div`
  height: 64px;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;
    img {
      border-right: 1px solid #eee;
      margin-right: 20px;
      padding-right: 20px;
    }
    a {
      font-weight: bold;
      color: #7159c1;
    }
  }
  aside {
    display: flex;
    align-items: center;
  }
`;
export const Profile = styled.div`
  display: flex;

  border-left: 1px solid #eee;
  margin-left: 20px;
  padding-left: 20px;
  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #333;
    }
    a {
      display: block;
      margin-top: 2px;
      color: #999;
      font-size: 12px;
    }
  }
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
`;
