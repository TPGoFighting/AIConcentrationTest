import Webcam from "react-webcam"
import { Layout, Menu } from "antd"
import { Route, Routes, useNavigate } from "react-router-dom"
import TestCenter from "./TestCenter"

const{Sider,Header,Content} = Layout  


function App() {
  const navigate = useNavigate()

  return (
    <Layout style={
      {
        height: "100vh",
        width: "100vw",
        margin: "0px",
        padding: "0px",
        border:"0px"
       }
    }>
      <Sider>
        <div style={
          {
            height: "32",
            margin: "16",
            background:'rgba(255,255,255,0.2)'
          }
        } />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={1}
          onClick={(e) => {
            if (e.key=='1') {
              navigate('/')
            }
            if (e.key=='2') {
              navigate('/report')
            }
          }}
          items={
          [{ key:1,label:"Test Center"},{key:2,label:"Data Report"}]
        } />
      </Sider>

      <Layout>
        <Header style={
          {
            background: '#fff', padding: '0 20px', fontSize: '20px', fontWeight: 'bold'
          }
        }>
          AI Concentration Test
        </Header>

        <Content style={{
          position: 'relative', background: 'black', overflow: 'hidden'
        }}>
          <Routes>
            <Route path="/" element={<TestCenter/>}/>
            <Route path="/report" element={<h1 style={{ color: "white", padding: "20px" }}>这里是数据报告页，待开发...</h1>} />
          </Routes>
        </Content>
        
</Layout>

    </Layout>
  )
}
  export default App