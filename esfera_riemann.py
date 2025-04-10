import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Crear una malla de puntos complejos en el plano
x = np.linspace(-2, 2, 100)
y = np.linspace(-2, 2, 100)
X, Y = np.meshgrid(x, y)
Z = X + 1j * Y

# Proyección estereográfica del plano complejo a la esfera de Riemann
def stereographic_projection(z):
    x = np.real(z)
    y = np.imag(z)
    denominator = 1 + x**2 + y**2
    Xs = 2*x / denominator
    Ys = 2*y / denominator
    Zs = (x**2 + y**2 - 1) / denominator
    return Xs, Ys, Zs

Xs, Ys, Zs = stereographic_projection(Z)

# Crear la figura 3D
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Dibujar la esfera unitaria
u = np.linspace(0, 2 * np.pi, 100)
v = np.linspace(0, np.pi, 100)
xs = np.outer(np.cos(u), np.sin(v))
ys = np.outer(np.sin(u), np.sin(v))
zs = np.outer(np.ones(np.size(u)), np.cos(v))
ax.plot_surface(xs, ys, zs, color='lightblue', alpha=0.3, edgecolor='none')

# Dibujar la proyección
ax.plot_surface(Xs, Ys, Zs, cmap='plasma', edgecolor='none')

# Estética
ax.set_box_aspect([1,1,1])
ax.set_title("Esfera de Riemann - Proyección Estereográfica", fontsize=14)
ax.set_axis_off()

plt.show()
