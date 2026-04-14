-- Fix broken Unsplash images in Towing Provider template
UPDATE templates
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
  preview_url = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop',
  data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              data,
              '{elements,2,props,image}',
              '"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=1080&fit=crop"'
            ),
            '{elements,3,props,products,0,image_url}',
            '"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"'
          ),
          '{elements,3,props,products,1,image_url}',
          '"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"'
        ),
        '{elements,4,props,features,1,image}',
        '"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop"'
      ),
      '{elements,4,props,features,0,image}',
      '"https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"'
    ),
    '{elements,4,props,features,2,image}',
    '"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"'
  )
WHERE slug = 'towing-provider';
