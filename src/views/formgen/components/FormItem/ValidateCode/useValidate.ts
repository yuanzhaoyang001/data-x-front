export function useValidate() {
  function generateRandomCode(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const drawCaptcha = (canvasRef: any, length: number) => {
    const canvas = canvasRef.value;
    const ctx = canvas.getContext("2d");
    const code = generateRandomCode(length);
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制背景
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 设置字体样式
    ctx.font = "24px Arial";
    ctx.fillStyle = "#333";

    // 旋转和绘制验证码，加上水平偏移量实现动画效果
    for (let i = 0; i < code.length; i++) {
      const char = code.charAt(i);
      const charX = 10 + i * 25;
      const charY = 28;
      const rotation = Math.random() * 0.2 - 0.1; // 随机旋转角度
      const fontSize = Math.floor(Math.random() * 8) + 18; // 随机字体大小
      ctx.save();
      ctx.translate(charX, charY);
      ctx.rotate(rotation);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = getRandomColor(); // 随机字体颜色
      ctx.fillText(char, -fontSize / 2, 0);
      ctx.restore();
    }

    // 添加扭曲效果
    // ctx.transform(1, 0.05, -0.05, 1, 0, 0);

    // 添加干扰线
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = "#888";
      ctx.stroke();
    }

    // 添加干扰点
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "#888";
      ctx.fill();
    }
    return code;
  };

  return {
    drawCaptcha
  };
}
