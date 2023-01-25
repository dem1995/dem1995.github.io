import os
files = [f for f in os.listdir('.') if os.path.isfile(f)]
print('<div id="lightgallery" class="row">')
for f in [f for f in files if f.endswith("jpg") and not f.endswith("_t.jpg")]:
	base_f = os.path.basename(f)
	base_f_t = base_f.rsplit(".")
	base_f_t.insert(1, "_t.")
	base_f_t = "".join(base_f_t)
	print((
	f'\t<a href="served_files/images/{base_f}" class="col-md-4 col-sm-12 col-xs-12">\n'
	f'\t<img class="img-responsive" src="served_files/images/{base_f_t}" />'
	))

print('</div>')