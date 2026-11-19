import { describe, test, expect } from 'vitest'
import axios from 'axios'
import FormData from 'form-data'
import qs from 'qs'

const url = 'https://petstore.swagger.io/v2/pet'

const testPet = () => ({
  id: 10,
  category: {
    id: 13,
    name: 'cat',
  },
  name: 'maggie',
  photoUrls: ['string'],
  tags: [
    {
      id: 2,
      name: 'mag',
    },
  ],
  status: 'available',
})

const api = axios.create({
  validateStatus: () => true,
})

describe('Добавление pet', ()=>{

    describe('Добавление pet', () => {
        test('test_post', async () => {
            const response = await api.post(url, testPet(), {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(200)
        })
    })

    describe('Добавление pet негативный тест', () => {
        test('test_post_negative', async () => {
            const pet = testPet()
            pet.id = 'id'
            const response = await api.post(url, pet, {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(500)
        })
    })

    describe('Добавление image в pet', () => {
        test('test_post2', async () => {
            const pet = testPet()
            const id = pet.id
            const image_url = "https://i.pinimg.com/originals/25/3c/99/253c991e7c7ea57c78cc387762a5d187.jpg"
            const image_response = await api.get(image_url, { responseType: 'arraybuffer' })
            const image_content = image_response.data
            const form = new FormData();
            form.append('file', image_content, {
                filename: 'image.jpg',
                contentType: 'image/jpeg',
            })
            const response = await api.post(
            `${url}/${id}/uploadImage`,
            form,
            { headers: form.getHeaders() }
            )     

            expect(response.status).toBe(200)
        })
    })

    describe('Добавление image в pet негативный тест', () => {
        test('test_post2_negative', async () => {
            const id = 0
            const image_url = "https://i.pinimg.com/originals/25/3c/99/253c991e7c7ea57c78cc387762a5d187.jpg"
            const image_response = await api.get(image_url, { responseType: 'arraybuffer' })
            const image_content = image_response.data
            const form = new FormData();
            form.append('file', image_content, {
                filename: 'image.jpg',
                contentType: 'image/jpeg',
            })
            const response = await api.post(
            `${url}/${id}/uploadImage`,
            form,
            { headers: form.getHeaders() }
            )     

            expect(response.status).toBe(404)
        })
    })

    describe('Изменение name и status в pet по id', () => {
        test('test_post3', async () => {
            const pet = testPet()
            const id = pet.id
            const name = 'Teddy'
            const status = 'available'
            const response = await api.post(`${url}/${id}`,
            qs.stringify({ name, status }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            )     

            expect(response.status).toBe(200)
        })
    })

    describe('Изменение name и status в pet по id негативный тест', () => {
        test('test_post3_negative', async () => {
            const id = 0
            const name = 'Teddy'
            const status = 'available'
            const response = await api.post(`${url}/${id}`,
            qs.stringify({ name, status }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            )     

            expect(response.status).toBe(404)
        })
    })
})

describe('Получение pet', ()=>{

    describe('Получение pet', () => {
        test('test_get', async () => {
            const pet = testPet()
            const id = pet.id
            const response = await api.get(`${url}/${id}`,{
                    headers: { 'Content-Type': 'application/json' },
                  })
                  
            expect(response.status).toBe(200)
            expect(response.data.id).toBe(pet.id)
            expect(response.data.name).toBe('Teddy')
        })
    })

    describe('Получение pet негативный тест', () => {
        test('test_get_negative', async () => {
            const id = 0
            const response = await api.get(`${url}/${id}`,{
                    headers: { 'Content-Type': 'application/json' },
                  })
                  
            expect(response.status).toBe(404)
        })
    })

    describe('Получение pet по status', () => {
        test('test_get2', async () => {
            const pet = testPet()
            const status = pet.status
            const response = await api.get(`${url}/findByStatus`, {
                params: { status },
            })
                  
            expect(response.status).toBe(200)
        })
    })

    describe('Получение pet по status негативный тест', () => {
        test('test_get2_negative', async () => {
            const pet = 'invalid_status'
            const status = pet.status
            const response = await api.get(`${url}/findByStatus`, {
                params: { status },
            })
                  
            expect(response.status).toBe(404)
        })
    })
})

describe('Изменение pet', ()=>{

    describe('Изменение pet', () => {
        test('test_put', async () => {
            const pet = testPet()
            const id = pet.id
            const newpet = structuredClone(testPet())
            newpet.category.name = "dog"
            const response = await api.put(url, newpet, {
                        headers: { 'Content-Type': 'application/json' },
            })
            const get_response = await api.get(`${url}/${id}`)
                  
            expect(response.status).toBe(200)
            expect(get_response.data.category.name).toBe('dog')
        })
    })

    describe('Изменение pet негативный тест', () => {
        test('test_put_negative', async () => {
            const pet = testPet()
            const id = pet.id
            const newpet = structuredClone(testPet())
            newpet.id = "id"
            const response = await api.put(`${url}/${id}`, newpet, {
                        headers: { 'Content-Type': 'application/json' },
            })
                  
            expect(response.status).toBe(405)
        })
    })
})

describe('Удаление pet', ()=>{

    describe('Удаление pet', () => {
        test('test_delete', async () => {
            const pet = testPet()
            const id = pet.id
            const response = await api.delete(`${url}/${id}`, {
                        headers: { 'Content-Type': 'application/json' },
            })
            const get_response = await api.get(`${url}/${id}`)
                  
            expect(response.status).toBe(200)
            expect(get_response.status).toBe(404)
        })
    })

    describe('Удаление pet', () => {
        test('test_delete_negative', async () => {
            const id = 0
            const newpet = structuredClone(testPet())
            newpet.category.name = "dog"
            const response = await api.delete(`${url}/${id}`, newpet, {
                        headers: { 'Content-Type': 'application/json' },
            })
            const get_response = await api.get(`${url}/${id}`)
                  
            expect(response.status).toBe(404)
        })
    })
})