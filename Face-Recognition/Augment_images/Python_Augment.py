import Augmentor
p = Augmentor.Pipeline(r"C:\Users\Admin\Documents\Augment_images\Students")
p.zoom(probability=0.3, min_factor=0.8, max_factor=1.5)
p.flip_top_bottom(probability=0.4)
p.random_brightness(probability=0.3, min_factor=0.3,max_factor=1.2)
p.random_distortion(probability=1, grid_width=4,grid_height=4,magnitude=8)
p.rotate(probability=1, max_left_rotation=5, max_right_rotation=5)
p.flip_left_right(probability=0.5)
p.zoom_random(probability=0.5, percentage_area=0.8)
p.flip_top_bottom(probability=0.5)

p.sample(200)
p.process()
