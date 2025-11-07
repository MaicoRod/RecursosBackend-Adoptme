# 🐾 Adoptme - API de Adopción de Mascotas

Proyecto desarrollado como parte del curso de **Backend 3 en Coderhouse**, que implementa una **API REST** para gestionar adopciones de mascotas.  
Incluye autenticación con **JWT**, documentación **Swagger**, **mocking de datos**, manejo de errores y está **dockerizada** para fácil despliegue.

---

## 🚀 Características

- Autenticación con **JWT + Cookies**  
- CRUD de usuarios, mascotas y adopciones  
- Documentación **Swagger**  
- Mocking con **Faker.js**  
- Tests con **Mocha + Chai + Supertest**  
- Manejo centralizado de errores  
- Imagen lista en **Docker Hub**

---

## 🐳 Docker

**Imagen:** https://hub.docker.com/r/maicoerodriguez/adoptmecoderhouse [maicoerodriguez/adoptmecoderhouse]

**Para descargarla:**

```bash
docker pull maicoerodriguez/adoptmecoderhouse
```

### Ejecución rápida

docker run -p 8080:8080   -e MONGO_URI="mongodb://admin:admin123@mongodb:27017/adoptme?authSource=admin"   -e JWT_SECRET="clave_segura"   maicoerodriguez/adoptmecoderhouse:1.0.0


## 🧩 Tecnologías

- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT + Bcrypt**
- **Swagger (OpenAPI 3.0)**
- **Mocha / Chai / Supertest**
- **Docker**

---

## 🧪 Testing

npm test


## Pruebas funcionales para:
- Adopciones (creación, validaciones, integridad)
- Usuarios y mascotas
- Casos de error

## 📘 Documentación API

Accedé a la documentación Swagger: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

## 👨‍💻 Autor

**Maico Rodriguez**  

