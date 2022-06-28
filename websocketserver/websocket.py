import asyncio
import websockets

async def receiver(websocket, path):
    data = await websocket.recv()
    print("> Received {}".format(data))

start_server = websockets.serve(receiver, '127.0.0.1', 9431)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
