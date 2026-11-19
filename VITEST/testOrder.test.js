import { describe, test, expect } from 'vitest'
import axios from 'axios'

const url = 'https://petstore.swagger.io/v2/store/order'

const testOrder = () => ({
  id: 34,
  petId: 50,
  quantity: 5,
  shipDate: '2026-10-15T12:51:46.815Z',
  status: 'placed',
  complete: true,
})

const api = axios.create({
  validateStatus: () => true,
})

describe('Добавление order', ()=>{

    describe('Добавление order', () => {
        test('test_post', async () => {
            const response = await api.post(url, testOrder(), {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(200)
        })
    }, 15000)

    describe('Добавление order негативный тест', () => {
        test('test_post_negative', async () => {
            const order = testOrder()
            order.id = 'id'
            const response = await api.post(url, order, {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(500)
        })
    })
})

describe('Получение order', ()=>{
    
    describe('Получение inventory по order', () => {
        test('test_get', async () => {
            const response = await api.get(url.replace('order', 'inventory'), {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(200)
        })
    })

    describe('Получение inventory по order негативный тест', () => {
        test('test_get_negative', async () => {
            const response = await api.get('https://petstore.swagger.io/v2/store/order/999999')

            expect(response.status).toBe(404)
        })
    })

    describe('Получение order по id', () => {
        test('test_get2', async () => {
            const order = testOrder()
            const id = order.id
            const response = await api.get(`${url}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(200)
            expect(response.data.quantity).toBe(order.quantity)
        })
    })

    describe('Получение order по id негативный тест', () => {
        test('test_get2_negative', async () => {
            const id = 0
            const response = await api.get(`${url}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(404)
        })
    })
})

describe('Удаление order', ()=>{

    describe('Удаление order', () => {
        test('test_delete', async () => {
            const order = testOrder()
            const id = order.id
            const response = await api.delete(`${url}/${id}`)

            const get_response = await api.get(`${url}/${id}`, {
            headers: { 'Content-Type': 'application/json' },
            })

            expect(response.status).toBe(200)
            expect(get_response.status).toBe(404)
        })
    })

    describe('Удаление order негативный тест', () => {
        test('test_delete_negative', async () => {
            const id = 0
            const response = await api.delete(`${url}/${id}`)

            expect(response.status).toBe(404)
        })
    })
})