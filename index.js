const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')
const token = '6737246411:AAEP2tEgQ0IOcgh70c5PlbOpeZaqB-wW_eI'

const bot = new TelegramApi(token, { polling: true })

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты должен ее угадать`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай! =)', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветствие!' },
        { command: '/info', description: 'Получить информацию о пользователе!' },
        { command: '/game', description: 'Поиграть в игру!' }
    ])

    bot.on('message', async msg => {
        console.log(msg)
        const text = msg.text
        const chatId = msg.chat.id
        // bot.sendMessage(chatId, `ты написал мне ${text}`)
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/p/popart_stickers/popart_stickers_001.webp?v=1706454605')
            return await bot.sendMessage(chatId, 'Добро пожаловать!')
        }
        if (text === '/info') {
            return await bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        return await bot.sendMessage(chatId, 'Я тибя ни панимаю')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Ты угадал, моя цифра - ${chats[chatId]}!`, againOptions)
        }
        return await bot.sendMessage(chatId, `Ты не угадал, моя цифра - ${chats[chatId]}!`, againOptions)


    })
}

start()