from aiohttp import web, WSMsgType

app = web.Application()

async def websocket_handler(request):
    resp = web.WebSocketResponse()

    await resp.prepare(request)
    await resp.send_str('{"user": "server", "message": "Welcome to the aiochat-room"}')

    try:
        for ws in request.app['sockets']:
            await ws.send_str('{"user": "server", "message": "We have a new friend!"}')
        request.app['sockets'].append(resp)

        async for msg in resp:
            if msg.type == web.WSMsgType.TEXT:
                for ws in request.app['sockets']:

                    await ws.send_str(msg.data)
            else:
                return resp
        return resp

    finally:
        request.app['sockets'].remove(resp)
        for ws in request.app['sockets']:
            await ws.send_str('{"user": "server", "message": "Some one left us:("}')

app.add_routes([web.get('/ws', websocket_handler)])

if __name__ == "__main__":
    app['sockets'] = []
    web.run_app(app)
