import os

print('File mtime:')
for f in ['public/customizer/coral-stripe-fit-38-lean.webp',
          'public/customizer/coral-stripe-fit-38-regular.webp',
          'public/customizer/coral-stripe-fit-38-tummy.webp',
          'public/customizer/shirt_model_coral_stripe_tummy.png']:
    print(f, os.path.getmtime(f), os.path.getsize(f))
