import React, { ChangeEvent, useRef, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';

import { FiPlus } from "react-icons/fi";
import mapIcon from "../../utils/mapIcon";

import Sidebar from "../../components/Sidebar";
import { Form } from '@unform/web';
import { FormHandles, SubmitHandler } from '@unform/core';
import { Input, InputFile, TextArea } from '../../components/Form';
import { FormData } from '../../interfaces';

import './index.scss';

const CreateOrphanage: React.FC = () => {
   const formRef = useRef<FormHandles>(null);
   const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
   const [openOnWeekends, setOpenOnWeekends] = useState(false);
   const [previewImages, setPreviewImages] = useState<string[]>([])

   const HandleMapClick = (event: LeafletMouseEvent) => {
      const { lat: latitude, lng: longitude } = event.latlng;
      setPosition({ latitude, longitude });
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

   const HandleSubmit: SubmitHandler<any> = (formData, { reset }) => {
      const { latitude, longitude } = position;

      const data = {
         ...formData,
         latitude,
         longitude,
         openOnWeekends
      };

      console.log(data)
      reset();
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

                  <Map
                     center={[-27.2092052, -49.6401092]}
                     style={{ width: '100%', height: 280 }}
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
                              <img src={image} alt={image} />
                           )
                        })}
                        <label htmlFor='image[]' className="new-image">
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
      </div>
   );
}

export default CreateOrphanage;

