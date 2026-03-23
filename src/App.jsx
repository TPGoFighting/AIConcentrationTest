  import { useState, useRef,useEffect } from "react"
import Webcam from "react-webcam"
import { Layout, Menu } from "antd"
import { Route, Routes, useNavigate } from "react-router-dom"

const{Sider,Header,Content} = Layout  

const { Hands } = window;
const { Camera } = window;

function App() {
  const navigate = useNavigate()
  const videoConstraints = {
    width: 1920,
    height: 1080, 
    facingMode: "user"
  };
  const [boxPosition, setBoxposition] = useState({ x: 100, y: 100 })
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const boxRef = useRef({ x: 100, y: 100 })
    
  useEffect(() => {
    const video = webcamRef.current.video
    const canvas = canvasRef.current
    const painter = canvas.getContext("2d")
    
    const onResults = (results) => {
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = video.videoWidth * dpr;
      canvas.height = video.videoHeight * dpr;
      painter.scale(dpr, dpr);
      painter.clearRect(0, 0, canvas.width, canvas.height)

      painter.fillStyle = "orange"
      painter.fillRect(boxRef.current.x - 50, boxRef.current.y - 50, 100, 100)
      
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        
        const indexX = landmarks[8].x * canvas.width
        const indexY = landmarks[8].y * canvas.height
        const thumbX = landmarks[4].x * canvas.width
        const thumbY = landmarks[4].y * canvas.height
        const dx = indexX - thumbX
        const dy = indexY - thumbY
        const distance = Math.sqrt(dx ** 2 + dy ** 2)

        painter.beginPath()
        painter.moveTo(indexX, indexY)
        painter.lineTo(thumbX, thumbY)
        painter.lineWidth = 3
        if (distance < 80) painter.strokeStyle = "blue"
        else painter.strokeStyle = "red"
        painter.stroke()

        for (let i = 0; i < landmarks.length; i++) {
          let x = landmarks[i].x * canvas.width
          let y = landmarks[i].y * canvas.height
                
          painter.beginPath()
          painter.arc(x, y, 5, 0, 2 * Math.PI)
          painter.fillStyle = "red"
          painter.fill()

        }
        painter.beginPath();
        painter.moveTo(landmarks[0].x * canvas.width, landmarks[0].y * canvas.height);
        painter.lineTo(landmarks[5].x * canvas.width, landmarks[5].y * canvas.height); // 移动到指根
        painter.lineTo(landmarks[6].x * canvas.width, landmarks[6].y * canvas.height); // 连到关节1
        painter.lineTo(landmarks[7].x * canvas.width, landmarks[7].y * canvas.height); // 连到关节2
        painter.lineTo(landmarks[8].x * canvas.width, landmarks[8].y * canvas.height); // 连到指尖

        painter.moveTo(landmarks[0].x * canvas.width, landmarks[0].y * canvas.height); // 移动到指根
        painter.lineTo(landmarks[1].x * canvas.width, landmarks[1].y * canvas.height); // 连到关节1
        painter.lineTo(landmarks[2].x * canvas.width, landmarks[2].y * canvas.height); // 连到关节2
        painter.lineTo(landmarks[3].x * canvas.width, landmarks[3].y * canvas.height); // 连到指尖
        painter.lineTo(landmarks[4].x * canvas.width, landmarks[4].y * canvas.height); // 连到指尖

        painter.stroke();
        if (distance < 80 &&
          indexX < boxRef.current.x + 50 &&
          indexX > boxRef.current.x - 50 &&
          indexY < boxRef.current.y + 50 &&
          indexY > boxRef.current.y - 50
        ) {
          setBoxposition({ x: indexX, y: indexY })
          boxRef.current = { x: indexX, y: indexY }
        }
      }
              
    }
    const handsModel = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`;
      }
    });
    handsModel.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // handsModel.setOptions({ maxNumHands: 1, minDetectionConfidence: 0.5 });
    handsModel.onResults(onResults)
    if (video) {
      const camera = new Camera(video, {
        onFrame: async () => {
          await handsModel.send({ image: video });
        },
        width: 1920,
        height: 1080
      });
      camera.start();

      return () => {
        camera.stop();
        handsModel.close();
      };
    }

    
    // const runHandPose = async() => {
    //   const model = await handpose.load()
    //   console.log("AI Loaded!")
          
    // const detect = async () => {
    //   if (webcamRef.current && webcamRef.current.video.readyState === 4) {
          
              
    //     canvas.height = video.videoHeight
    // canvas.width = video.videoWidth * dpr;
              
    // canvas.height = video.videoHeight * dpr;
              

              
              

    //     const hands = await model.estimateHands(video)


    //     painter.fillStyle = "orange"
    //     painter.fillRect(boxRef.current.x - 50, boxRef.current.y - 50, 100, 100)

    //     if (hands.length > 0) {
    // const indexX = hands[0].landmarks[8][0]
    // const indexY = hands[0].landmarks[8][1]
    // const thumbX = hands[0].landmarks[4][0]
    // const thumbY = hands[0].landmarks[4][1]

    //       console.log(indexX, indexY)
    //       console.log(thumbX, thumbY)
                
    //     const dx = indexX - thumbX
    //     const dy = indexY - thumbY
    //     const distance = Math.sqrt(dx ** 2 + dy ** 2)

    //     painter.beginPath()
    //     painter.moveTo(indexX, indexY)
    //     painter.lineTo(thumbX, thumbY)
    //     painter.lineWidth = 3
    //     if (distance < 80) painter.strokeStyle = "blue"
    //     else painter.strokeStyle = "red"
    //     painter.stroke()

    //     for (let i = 0; i < hands[0].landmarks.length; i++) {
    //       let x = hands[0].landmarks[i][0]
    //       let y = hands[0].landmarks[i][1]
                
    //       painter.beginPath()
    //       painter.arc(x, y, 5, 0, 2 * Math.PI)
    //       painter.fillStyle = "red"
    //       painter.fill()

    //       painter.beginPath();
    //       painter.moveTo(hands[0].landmarks[0][0], hands[0].landmarks[0][1]); 
    //       painter.lineTo(hands[0].landmarks[5][0], hands[0].landmarks[5][1]); // 移动到指根
    //       painter.lineTo(hands[0].landmarks[6][0], hands[0].landmarks[6][1]); // 连到关节1
    //       painter.lineTo(hands[0].landmarks[7][0], hands[0].landmarks[7][1]); // 连到关节2
    //       painter.lineTo(hands[0].landmarks[8][0], hands[0].landmarks[8][1]); // 连到指尖

    //       painter.moveTo(hands[0].landmarks[0][0], hands[0].landmarks[0][1]); // 移动到指根
    //       painter.lineTo(hands[0].landmarks[1][0], hands[0].landmarks[1][1]); // 连到关节1
    //       painter.lineTo(hands[0].landmarks[2][0], hands[0].landmarks[2][1]); // 连到关节2
    //       painter.lineTo(hands[0].landmarks[3][0], hands[0].landmarks[3][1]); // 连到指尖
    //       painter.lineTo(hands[0].landmarks[4][0], hands[0].landmarks[4][1]); // 连到指尖

    //       painter.stroke();
                  
    //     }
    //     if (distance < 80 &&
    //       indexX < boxRef.current.x + 50 &&
    //       indexX > boxRef.current.x - 50 &&
    //       indexY < boxRef.current.y + 50 &&
    //       indexY > boxRef.current.y - 50
    //     ) {
    //       setBoxposition({ x: indexX, y: indexY })
    //       boxRef.current = { x: indexX, y: indexY }
    //     }
    //   }
              
    // }
    //   requestAnimationFrame(detect)

    // }
    // detect() 

    // }
    //   runHandPose()
  }
    , [])
    
  

  //   return (<div style={
  //     {
  //       position: "relative",
  //       height: "100vh",
  //       width: "100vw",
  //       backgroundColor:"black"
  //     }
  //   }>
  //     {/* <div>方块x坐标：{boxPosition.x}</div> */}

  //     <button onClick={() =>
  //     {
  //       setBoxposition({x:200,y:100})
  //       }
  //     }></button>

    

  //   </div>)
  // }

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
  <div style={{
        position:"absolute",
        height: "100px",
        width: "100px",
        top: boxPosition.y-50+"px",
        left:boxPosition.x-50+"px"
      }}></div>

      <Webcam ref={webcamRef}
        videoConstraints={videoConstraints}
        style={
          {
            objectFit: "contain",
            position: "absolute",
            transform: "scaleX(-1)",
            opacity: 0,
            top: 0,
            // right: 0,
            left: 0,
            height: "100%",
            width: "100%",
            transformOrigin: "center",
            // display: "block"            
           }
      }>

      </Webcam>
      <canvas ref={canvasRef}
        style={
          {
            objectFit:"contain",
            position: "absolute",
            transform: "scaleX(-1)",
            top: 0,
            // right: 0,
            left: 0,
            height: "100%",
            width: "100%",
            transformOrigin: "center",
            // display:"block"
        }
      }></canvas>
        </Content>
        
</Layout>

    </Layout>
  )
}
  export default App