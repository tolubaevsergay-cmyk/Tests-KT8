import { describe, test, expect } from 'vitest'
import axios from 'axios'

const url = 'https://petstore.swagger.io/v2/user'


const testUser = () => ({
  id: 100,
  username: 'tolubaev',
  firstName: 'Sergay',
  lastName: 'Tol',
  email: 'tolubaevsi24@st.ithub.ru',
  password: '12345',
  phone: '',
  userStatus: 1,
})

const api = axios.create({
  validateStatus: () => true,
})


describe('Добавление user', () => {
  describe('Добавление user передачей объекта', () => {

    test('test_post', async () => {
      const response = await api.post(url, testUser(), {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })
  describe('Добавление user передачей объекта', () => {

    test('test_post_negative', async () => {
      const user = testUser()
      user.id = 'not_a_number'
      const response = await api.post(url, user, {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(500)
    })
  })


  describe('Добавление user передачей массива', () => {
    test('test_post2', async () => {
      const user = testUser()
      const newuser = { ...user }
      newuser.firstName = "Maomao"
      const response = await api.post(`${url}/createWithArray`, [user, newuser], {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('Добавление user передачей массива негативный тест', () => {
    test('test_post2_negative', async () => {
      const user = testUser()
      const newuser = { ...user }
      newuser.id = "Maomao"
      const response = await api.post(`${url}/createWithArray`, [user, newuser], {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(500)
    })
  })

  describe('Добавление user передачей листа', () => {
    test('test_post3', async () => {
      const user = testUser()
      const newuser = { ...user }
      newuser.firstName = "Maomao"
      const users = [user, newuser]
      const response = await api.post(`${url}/createWithList`, users, {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('Добавление user передачей листа негативный тест', () => {
    test('test_post3_negative', async () => {
      const user = testUser()
      const newuser = { ...user }
      newuser.id = "Maomao"
      const users = [user, newuser]
      const response = await api.post(`${url}/createWithList`, users, {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(500)
    })
  })
})

describe('Получение user', ()=>{

    describe('Получение user по username', () => {
    test('test_get', async () => {
      const user = testUser()
      const username = user.username
      const response = await api.get(`${url}/${username}`,{
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('Получение user по username негативный тест', () => {
    test.each([
    ['unknown'],
    ['nonexistent_123'],
    ['user with space'],
    ['!@#$%'],
    ['a'.repeat(300)],
  ])('test_get_negative', async (username) => {
      const response = await api.get(`${url}/${username}`,{
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(404)
    })
  })

  describe('login для user по username и password', () => {
    test('test_get2', async () => {
      const user = testUser()
      const login = user.username
      const password = user.password
      const response = await api.get(`${url}/login`,{
        params: { login, password },
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('login для user по username и password негативный тест', () => {
    test('test_get2_negative', async () => {
      const user = testUser()
      const login = user.username
      const password = 123
      const response = await api.get(`${url}/login`,{
        params: { login, password },
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(400)
    })
  })

  describe('logout для user', () => {
    test('test_get3', async () => {
      const response = await api.get(`${url}/logout`, {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(200)
    })
  })

  describe('logout для user негативный тест', () => {
    test('test_get3_negative', async () => {
      const response = await api.get(`${url}/logout`, {
        headers: { 'Content-Type': 'application/json' },
      })

      expect(response.status).toBe(404)
    })
  })
})

describe('Изменение user', ()=>{

    describe('Изменение user', () => {
        test('test_put', async () => {
            const user = testUser()
            const username = user.username
            const newuser = { ...user }
            newuser.username = 'Maomao'
            const response = await api.put(`${url}/${username}`, newuser, {
            headers: { 'Content-Type': 'application/json' },
        })
            const response2 = await api.get(`${url}/${newuser.username}`,{
            headers: { 'Content-Type': 'application/json' },
        })

            expect(response.status).toBe(200)
            expect(response2.status).toBe(200)
        })
    })

    describe('Изменение user негативный тест', () => {
        test('test_put_negative', async () => {
            const user = testUser()
            const username = user.username
            const newuser = { ...user }
            newuser.id = 'Maomao'
            const response = await api.put(`${url}/${username}`, newuser, {
            headers: { 'Content-Type': 'application/json' },
        })

            expect(response.status).toBe(500)
        })
    })
})

describe('Удаление user', ()=>{

    describe('Удаление user', ()=>{
        test('test_delete', async () => {
            const user = testUser()
            const username = 'Maomao'
            const response = await api.delete(`${url}/${username}`)

            expect(response.status).toBe(200)
        })
    })

    describe('Удаление user негативный тест', ()=>{
        test('test_delete_negative', async () => {
            const user = testUser()
            const username = user.username
            const response = await api.delete(`${url}/${username}`)

            expect(response.status).toBe(404)
        })
    })
})
