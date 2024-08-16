import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  width: 56px;
  height: 55px;
  top: 20px;
  left: calc(50% - 28px);
  border-radius: 40px 40px 40px 40px;
  background-color: rgba(222, 222, 222, 1);  // FIXME(yoojin): change color
  opacity: 0px;
`

const Ellipse = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  top: 7px;
  left: 8px;
  border-radius: 50%;
  background-color: rgba(115, 119, 143, 1);
  border-color: rgba(241, 243, 248, 1);
  text-align: center;
`

const Text = styled.text`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: Manrope;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  text-align: left;
`

export default function Versus() {

  return (
    <Container>
      <Ellipse>
        <Text>VS</Text>
      </Ellipse>
    </Container>
  )
}