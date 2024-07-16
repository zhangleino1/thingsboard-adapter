import numpy as np
import matplotlib.pyplot as plt
import matplotlib
# 指定默认字体
matplotlib.rcParams['font.sans-serif'] = ['SimSun'] 
matplotlib.rcParams['font.family']='sans-serif'
# 解决负号'-'显示为方块的问题
matplotlib.rcParams['axes.unicode_minus'] = False 

# 生成示例数据
fs = 200  # 采样频率
t = np.arange(0, 1, 1/fs)  # 时间序列
f1, f2 = 50, 120  # 信号频率
signal = np.sin(2 * np.pi * f1 * t) + 0.5 * np.sin(2 * np.pi * f2 * t)  # 合成信号

# 傅里叶变换
fft_signal = np.fft.fft(signal)
frequencies = np.fft.fftfreq(len(signal), 1/fs)

# 设计带通滤波器，只保留50Hz附近的频率
band = (frequencies > 45) & (frequencies < 55)
filtered_fft_signal = np.zeros_like(fft_signal)
filtered_fft_signal[band] = fft_signal[band]

# 逆傅里叶变换
filtered_signal = np.fft.ifft(filtered_fft_signal)

# 绘图比较
plt.figure(figsize=(12, 8))

# 原始信号
plt.subplot(3, 1, 1)
plt.plot(t, signal)
plt.title('原始信号')
plt.xlabel('时间 [秒]')
plt.ylabel('幅度')

# 频域信号
plt.subplot(3, 1, 2)
plt.plot(frequencies, np.abs(fft_signal))
plt.title('频域信号（原始）')
plt.xlabel('频率 [赫兹]')
plt.ylabel('幅度')

# 滤波后的信号
plt.subplot(3, 1, 3)
plt.plot(t, filtered_signal.real)
plt.title('滤波后的信号（50Hz）')
plt.xlabel('时间 [秒]')
plt.ylabel('幅度')

plt.tight_layout()
plt.show()
