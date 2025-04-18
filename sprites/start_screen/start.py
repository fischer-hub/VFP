from src.scene import Scene, Clickable, ChangeScene, Commentable
from src.text import Text
import pygame as pg
from lib.helper import path, save_config, check_update, update_game
from src.animate import StripAnimate
from datetime import datetime
import os, sys



class SizeMeter(Clickable):
    '''A class implementing a clickable object that triggers the main player talk function, given a sound (comment) to play at the same time.'''
    def __init__(self, rect, scene, idx, animation = None, hover_cursor = 0, sound_lst = None):
        super().__init__(rect, animation, hover_cursor, sound_lst)
        self.scene = scene
        self.idx = idx
    
    def on_click(self):
        self.scene.fg_lst['size_meter'].index = self.idx
        self.scene.config['scale_factor'] = self.idx
        save_config(self.scene.config)

        # check if game is running as bundled exe or not becaus the restart path will differ here
        # if we are bundled pyinstaller will extend the sys module with the new frozen attribute so this will return true
        if getattr(sys, 'frozen', False):
            print(f"Restarting game {sys.executable} to apply size change..")
            pg.quit()
            os.system(sys.executable)
            sys.exit()

        else:
            print(f"Restarting game {sys.executable + 'python' + sys.argv[0]} to apply size change..")
            os.execv(sys.executable, ['python'] + sys.argv)

    

class Btn(Clickable):
    def __init__(self, rect, animation = None, sound = None, hover_cursor = 0, fct = None, id = None, scene = None):
        super().__init__(rect, animation, hover_cursor, sound)
        self.sound = sound
        self.fct = fct
        self.clicked = False
        self.scene = scene
        self. id = id

    def on_click(self):
        if not self.clicked:
            self.animation.pause = False
            sound = pg.mixer.Sound(path(self.sound))
            sound.play()
            self.clicked = True
            self.scene.last_clickable_id = self.id
            pg.time.set_timer(event = pg.USEREVENT + 2, millis = 800, loops = 1)
        else:
            self.clicked = False
            if self.fct:
                return self.fct()


class Msg(Clickable):
    def __init__(self, rect, animation = None, sound = None, hover_cursor = 0, scene = None):
        super().__init__(rect, animation, hover_cursor, sound)
        self.sound = sound
        self.scene = scene
        self.clicked = False

    def on_click(self):
        if not self.clicked:
            self.animation.pause = False
            sound = pg.mixer.Sound(path(self.sound))
            sound.play()
            self.clicked = True
            self.scene.last_clickable_id = 'caution_msg'
            pg.time.set_timer(event = pg.USEREVENT + 2, millis = 800, loops = 1)
        else:
            self.scene.clickable_lst.pop('caution_msg')
            self.scene.fg_lst.pop('caution_msg')
            self.clicked = False


class StartScreen(Scene):
    def __init__(self, player, cursor, collision_file = None, scale_factor = 6, dev = False, config = None):
        super().__init__(player, cursor, collision_file, scale_factor, dev)
        self.id = 3
        self.config = config

        # only check for update once a day to not exceed github api limit (also this is really slow)
        if 'update_checked' not in self.config:
            self.config['update_checked'] = 'init'

        if self.config['update_checked'] != datetime.today().strftime('%Y-%m-%d'):
            self.config['update_available'] = check_update(self.config['version'])
            self.config['update_checked'] = datetime.today().strftime('%Y-%m-%d')
            save_config(self.config)        

        if 'update_available' not in self.config:
            self.config['update_available'] = False

        self.player_spawn = (-100, -100)
        

        # sprites
        bg = StripAnimate('scenes/start_screen/bg.png', img_width = 320, frame_rate = 1, scale_factor = scale_factor, cycles = 1, default_frame = 0, pause = True, once = True)
        start_button = StripAnimate('scenes/start_screen/start_button.png', img_width = 320, frame_rate = 3, scale_factor = scale_factor, cycles = 1, default_frame = 0, pause = True, once = True)
        update_button = StripAnimate('scenes/start_screen/update_button.png', img_width = 320, frame_rate = 3, scale_factor = scale_factor, cycles = 1, default_frame = 0 if self.config['update_available'] else 1, pause = True, once = True)
        new_game = StripAnimate('scenes/start_screen/new_game.png', img_width = 320, frame_rate = 3, scale_factor = scale_factor, cycles = 1, default_frame = 0, pause = True, once = True)
        size_meter = StripAnimate('scenes/start_screen/size_meter.png', img_width = 320, frame_rate = 1, scale_factor = scale_factor, cycles = 1, default_frame = scale_factor, pause = True, once = True)
        caution_msg = StripAnimate('scenes/start_screen/caution_message.png', img_width = 320, frame_rate = 3, scale_factor = scale_factor, cycles = 1, default_frame = 0, pause = True, once = True)

        version_txt = Text(f"version: {self.config['version']}{', dev' if dev else ''}{', update available!' if self.config['update_available'] else ''}", pg.Rect(0,-20,0,0), 4, (255, 255, 255), scale_factor)

        # clickables
        start_button_clickable = Btn(pg.Rect(460, 120, 1050, 220), sound = path('sounds', 'button_click.ogg'), animation = start_button, scene = self, id = 'start_button', fct = lambda: (4,(0,0)))
        new_game_button_clickable = Btn(pg.Rect((460, 440, 1050, 220)), sound = path('sounds', 'button_click.ogg'), animation = new_game, fct = lambda: (0,(0,0)), scene = self, id = 'new_game')
        update_button_clickable = Btn(pg.Rect((460, 770, 1050, 220)), sound = path('sounds', 'button_click.ogg'), animation = update_button, scene = self, id = 'update_button', fct = update_game)
        caution_msg_clickable = Msg(pg.Rect((524, 708, 800, 150)), sound = path('sounds', 'button_click.ogg'), animation = caution_msg, scene = self)

        self.clickable_lst = { '1': SizeMeter(pg.Rect(1670, 290, 90, 65), self, 1), '2': SizeMeter(pg.Rect(1670, 395, 90, 65), self, 2), '3': SizeMeter(pg.Rect(1670, 495, 90, 65), self, 3),
                               '4': SizeMeter(pg.Rect(1670, 610, 90, 65), self, 4), '5': SizeMeter(pg.Rect(1675, 730, 90, 70), self, 5), '6': SizeMeter(pg.Rect(1680, 840, 90, 70), self, 6),
                               }

        self.bg_lst = {}
        self.fg_lst = {'bg': bg, 'start_button': start_button, 'update_button': update_button, 'size_meter': size_meter,
                       'new_game': new_game, 'version': version_txt}
        
        self.clickable_lst.update({'start_button': start_button_clickable, 'new_game': new_game_button_clickable})

        if self.config['update_available']: self.clickable_lst.update({'update_button': update_button_clickable})


        if self.config['no_config']:
            self.fg_lst.update({'caution_msg': caution_msg})
            self.clickable_lst.update({'caution_msg': caution_msg_clickable})
