import React, { ChangeEvent, MouseEvent, useRef, useState } from "react";
import api from "../../config/AxiosConfig";
import { useHistory } from "react-router-dom";

import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import mapIcon from "../../utils/mapIcon";
import Alert from '../../utils/Alert';

import Sidebar from "../../components/Sidebar";
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Input, InputFile, TextArea } from '../../components/Form';
import { FormData as IFormData, ValidationErrors } from '../../interfaces';

import * as Yup from 'yup';
import errors from '../../utils/errors';

import './index.scss';

const CreateOrphanage: React.FC = () => {
   const history = useHistory();
   const formRef = useRef<FormHandles>(null);
   const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
   const [openOnWeekends, setOpenOnWeekends] = useState(true);
   const [previewImages, setPreviewImages] = useState<string[]>([]);
   const [validationErrors, setValidationErrors] = useState({
      images: {
         success: true,
         message: ''
      },
      position: {
         success: true,
         message: ''
      }
   });

   const HandleMapClick = (event: LeafletMouseEvent) => {
      const { lat: latitude, lng: longitude } = event.latlng;
      setPosition({ latitude, longitude });
   };

   const HandleDeleteImage = (image: string) => {
      setPreviewImages(previewImages.filter(previewImage => previewImage !== image));
   };

   const HandleSelectImages = (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;

      if (!files)
         return;

      const selectedImages = Array.from(files);

      const selectedImagesPreview = selectedImages.map(image => {
         return URL.createObjectURL(image);
      });

      const selectedImage = URL.createObjectURL(selectedImages[0]);

      if (files.length > 1) {
         setPreviewImages(selectedImagesPreview);
      } else {
         setPreviewImages([...previewImages, selectedImage]);
      }
   };

   const HandleSubmit: SubmitHandler<IFormData> = async (formData) => {
      const { latitude, longitude } = position;
      const { name, about, instructions, opening_hours, images } = formData;

      try {
         const orphanageData = {
            ...formData,
            latitude,
            longitude,
            openOnWeekends
         }

         const schema = Yup.object().shape({
            name: Yup.string().required(errors['orphanage']['nameError']),
            about: Yup.string().required(errors['orphanage']['aboutError']),
            instructions: Yup.string().required(errors['orphanage']['instructionsError']),
            position: Yup.object().shape({
               latitude: Yup.string().required(errors['orphanage']['locationError']),
               longitude: Yup.string().required(errors['orphanage']['locationError'])
            }),
            opening_hours: Yup.string().required(errors['orphanage']['openingHoursError']),
            previewImages: Yup.array(Yup.string()).required(errors['orphanage']['imagesError'])
         });

         await schema.validate(orphanageData, { abortEarly: false });

         const data = new FormData();
         data.append('name', name);
         data.append('about', about);
         data.append('instructions', instructions);
         data.append('opening_hours', opening_hours);
         data.append('latitude', String(latitude));
         data.append('longitude', String(longitude));
         data.append('open_on_weekends', String(openOnWeekends));
         Array.from(images).forEach(image => {
            data.append('images', image);
         })

         await api.post('/orphanages', data);

         Alert('Orfanato registrado com sucesso.');
         history.push('/app');

      } catch (error) {
         if (error instanceof Yup.ValidationError) {
            let errorMessages: ValidationErrors = {};
            console.log(validationErrors['images']['success'])
            error.inner.forEach(err => {
               errorMessages[err.path] = err.message;
            });

            formRef.current?.setErrors(errorMessages);

            if (previewImages.length === 0) {
               setValidationErrors({
                  ...validationErrors,
                  images: {
                     success: false,
                     message: 'asdsad'
                  }
               })

            } else {
               setValidationErrors({
                  ...validationErrors,
                  images: {
                     success: true,
                     message: ''
                  }
               })
            }

            if (position.latitude === 0 || position.longitude === 0) {
               setValidationErrors({
                  ...validationErrors,
                  position: {
                     success: false,
                     message: errorMessages['position.latitude'] || errorMessages['position.longitude']
                  }
               })
            } else {
               setValidationErrors({
                  ...validationErrors,
                  position: {
                     success: true,
                     message: ''
                  }
               })
            }
         }
      }
   };

   return (
      <div id="page-create-orphanage">

         <Sidebar />

         <main>
            <Form
               ref={formRef}
               className="create-orphanage-form"
               onSubmit={HandleSubmit}
            >
               <fieldset>
                  <legend>Dados</legend>

                  {!validationErrors['position']['success'] && <span style={{ color: 'red' }}>{validationErrors.position.message}</span>}
                  <Map
                     center={[-27.2092052, -49.6401092]}
                     style={!validationErrors.position.success ? {
                        width: '100%',
                        height: 280,
                        borderColor: 'red'
                     } : {
                           width: '100%',
                           height: 280,
                        }}
                     zoom={15}
                     onclick={HandleMapClick}
                  >
                     <TileLayer
                        url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                     />

                     {position.latitude !== 0 && (
                        <Marker
                           interactive={false}
                           icon={mapIcon}
                           position={[position.latitude, position.longitude]}
                        />
                     )}
                  </Map>

                  <div className="input-block">
                     <label htmlFor="name">Nome</label>
                     <Input
                        id='name'
                        name='name'
                        type='text'
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
                     <TextArea
                        id="about"
                        name='about'
                        maxLength={300}
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="images">Fotos</label>

                     <div className="images-container">
                        {previewImages?.map(image => {
                           return (
                              <div className='image-item' onClick={() => HandleDeleteImage(image)}>
                                 <img src={image} alt={image} />
                              </div>
                           )
                        })}
                        <label
                           htmlFor='image[]'
                           className="new-image"
                           style={validationErrors['images']['success'] === false ? { borderColor: 'red' } : {}}
                        >
                           <FiPlus size={24} color="#15b6d6" />
                        </label>
                     </div>

                     <InputFile
                        id='image[]'
                        name='images'
                        multiple
                        onChange={HandleSelectImages}
                     />
                  </div>
               </fieldset>

               <fieldset>
                  <legend>Visitação</legend>

                  <div className="input-block">
                     <label htmlFor="instructions">Instruções</label>
                     <TextArea
                        id="instructions"
                        name='instructions'
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="opening_hours">Horário de funcionamento</label>
                     <Input
                        id="opening_hours"
                        name='opening_hours'
                        type='text'
                     />
                  </div>

                  <div className="input-block">
                     <label htmlFor="open_on_weekends">Atende fim de semana</label>

                     <div className="button-select">
                        <button
                           type="button"
                           className={openOnWeekends ? 'active' : ''}
                           onClick={() => setOpenOnWeekends(true)}
                        >
                           Sim
                        </button>
                        <button
                           type="button"
                           className={!openOnWeekends ? 'active' : ''}
                           onClick={() => setOpenOnWeekends(false)}
                        >
                           Não
                        </button>
                     </div>
                  </div>
               </fieldset>

               <button className="confirm-button" type="submit">
                  Confirmar
               </button>
            </Form>
         </main>
      </div >
   );
}

export default CreateOrphanage;

