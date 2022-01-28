import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import '../scss/Manage.scss';
import Footer from './components/Footer';
import { Button, Form, Navbar } from 'react-bootstrap';


const Manage = () => {
    const apiUrl = 'http://localhost:5000/'
    
    useEffect(() => {
        const loadingBubbles = document.getElementById('loading-bubbles')
        const form = document.getElementById('full-form')
        const metatagsGrp = document.getElementById('edit-photo-metatags-grp')
        const password = document.querySelectorAll('#password-lbl, #password')
        const liList  = [...document.querySelectorAll("#create-gallery-li,  #create-photo-li,  #edit-gallery-li,  #edit-photo-li,  #delete-li")]
        const btnList = [...document.querySelectorAll("#create-gallery-btn, #create-photo-btn, #edit-gallery-btn, #edit-photo-btn, #delete-btns")]
        const deleteBtnList = [...document.querySelectorAll('#delete-gallery-btn, #delete-photo-btn')]
        const lblList = [...document.querySelectorAll("#create-gallery-grp, #create-photo-grp, #edit-gallery-grp, #edit-photo-grp, #delete-grp")]
        const activeLi = 'background-color: inherit; border-color: transparent; color: hsl(39, 77%, 83% , 1);'
        const labelError = 'border: 2px solid red; border-radius: 1rem;'
        const activeLiElements = 'display: unset;'
        const unActiveLiElements = 'display: none;'
        
        function makeAcitve(element , btn, lbl){
            liList.forEach(li => li.style.cssText = null)
            element.style.cssText = activeLi
            btnList.forEach(btn => btn.style.cssText = unActiveLiElements)
            lblList.forEach(lbl => lbl.style.cssText = unActiveLiElements)
            btn.style.cssText = activeLiElements
            lbl.style.cssText = activeLiElements
        }
        
        liList.forEach((li, index) => li.addEventListener('click', ()=> makeAcitve(li ,btnList[index], lblList[index])))
        
        // make first li group active (Create Gallery)
        makeAcitve(liList[0], btnList[0], lblList[0])

        //Create Gallery
        btnList[0].addEventListener('click', async(event)=> {
            event.preventDefault();
            const formInputs = [...document.querySelectorAll('#create-gallery-title, #create-gallery-file')]
            const formElements = [...document.querySelectorAll('#create-gallery-title-lbl, #create-gallery-file-lbl')]
            const formData = new FormData()
            
            if (formInputs[0].value.length && formInputs[1].files.length && password[1].value.length != 0) {
                loadingBubbles.style.display = 'unset'
                formData.append('title' , formInputs[0].value)
                formData.append('file' , formInputs[1].files[0])
                formData.append('password' , password[1].value)
                formElements.forEach(elm => elm.style.cssText = null)
                password[0].style.cssText = null
                await fetch(apiUrl+'gallery/create' , {method: 'POST', body: formData})
                .then(() => {
                    form.reset();
                    loadingBubbles.style.display = 'none'
                })
            
            } 
            else if (formInputs[0].value.length == 0){ formElements[0].style.cssText = labelError }
            else if (formInputs[1].files.length == 0){ formElements[1].style.cssText = labelError }
            else if (password[1].value.length == 0){ password[0].style.cssText = labelError }
        }) //end Create Gallery

        // Create Phoho
        btnList[1].addEventListener('click', async(event)=> {
            event.preventDefault();
            const formInputs = [...document.querySelectorAll('#create-photo-gallery-id, #create-photo-file')]
            const formElements = [...document.querySelectorAll('#create-photo-id-lbl, #create-photo-file-lbl')]
            const formData = new FormData()
            
            if (formInputs[0].value.length && formInputs[1].files.length && password[1].value.length != 0) {
                loadingBubbles.style.display = 'unset'
                formData.append('galleryId' , formInputs[0].value)
                formData.append('password' , password[1].value)
                
                formElements.forEach(elm => elm.style.cssText = null)
                password[0].style.cssText = null
                
                var totalfiles = formInputs[1].files.length;
                for (var index=0; index < totalfiles; index++){ formData.append('file' , formInputs[1].files[index]) }
                await fetch(apiUrl+'photo/create' , {method: 'POST', body: formData})
                    .then(() => {
                        form.reset();
                        loadingBubbles.style.display = 'none'
                    })
            
            } 
            else if (formInputs[0].value.length == 0){ formElements[0].style.cssText = labelError }
            else if (formInputs[1].files.length == 0){ formElements[1].style.cssText = labelError }
            else if (password[1].value.length == 0){ password[0].style.cssText = labelError }

        })//end Create Phoho
    
        //Edit Gallery
        btnList[2].addEventListener('click', async(event)=> {
            event.preventDefault();
            const formInputs = [...document.querySelectorAll('#edit-gallery-id, #edit-gallery-title, #edit-gallery-file')]
            const formElements = [...document.querySelectorAll('#edit-gallery-id-lbl, #edit-gallery-title-lbl, #edit-gallery-file-lbl')]
            const formData = new FormData()
            
            if (formInputs[0].value.length != 0) {
                const galleryId = formInputs[0].value
                if (formInputs[1].value.length + formInputs[2].value.length != 0){
                    if (formInputs[1].value.length != 0) {
                        formData.append('title' , formInputs[1].value)
                    } 
                    if (formInputs[2].value.length !=0){
                        formData.append('file' , formInputs[2].files[0])
                    }
                    if (password[1].value.length != 0){
                        formData.append('password', password[1].value)
                        formElements.forEach(elm => elm.style.cssText = null)
                        loadingBubbles.style.display = 'unset'
                        await fetch(apiUrl+'gallery/'+galleryId+'/edit' , {method: 'PATCH', body: formData})
                        .then(() => {
                            form.reset();
                            loadingBubbles.style.display = 'none'
                        })
                    }else {password[0].style.cssText = labelError}
                }
                else {  
                    formElements[1].style.cssText = labelError
                    formElements[2].style.cssText = labelError
                    alert('Most fill one of (New Title) or (New Thumnail)')
                }
            }
            else if (formInputs[0].value.length == 0){ formElements[0].style.cssText = labelError }
        }) //end Edit Gallery


        /* Edit Photo */
        
        // Checkbox function 
        const checkbox = document.getElementById('edit-metatags-checkbox')
        checkbox.addEventListener('click', () => {
            if (checkbox.checked == true){ 
                metatagsGrp.style.cssText = 'display: unset'
            } else {metatagsGrp.style.cssText = 'display: none'}
        }) //end Checkbox function

        // Edit Photo
        btnList[3].addEventListener('click', async(event)=> {
            event.preventDefault();
            const formInputs = [...document.querySelectorAll('#edit-photo-id, #edit-photo-gallery-id, #edit-photo-file')]
            const formLabels = [...document.querySelectorAll('#edit-photo-gallery-id-lbl, #edit-photo-file-lbl, #edit-metatags-checkbox-lbl')]
            const formIdLbl = document.getElementById('edit-photo-id-lbl')
            const formData = new FormData()
            const metatagesLabels = [...document.querySelectorAll('#edit-photo-imgsize-lbl, #edit-photo-name-lbl, #edit-photo-shutter-lbl, #edit-photo-aperture-lbl, #edit-photo-datetime-lbl, #edit-photo-make-lbl, #edit-photo-model-lbl, #edit-photo-fnumber-lbl, #edit-photo-lensmodel-lbl, #edit-photo-lenslenth-lbl, #edit-photo-imgformat-lbl, #edit-photo-software-lbl, #edit-photo-isospeed-lbl')]
            const metatagesInputs = [...document.querySelectorAll('#edit-photo-imgsize, #edit-photo-name, #edit-photo-shutter, #edit-photo-aperture, #edit-photo-datetime, #edit-photo-make, #edit-photo-model, #edit-photo-fnumber, #edit-photo-lensmodel, #edit-photo-lenslenth, #edit-photo-imgformat, #edit-photo-software, #edit-photo-isospeed')]
            var oldPhotoId = 0
            
            formIdLbl.style.cssText = null
            if (formInputs[0].value.length != 0){
                oldPhotoId = formInputs[0].value
                if ( formInputs[1].value.length + formInputs[2].files.length != 0 || checkbox.checked == true){
                    formLabels.forEach(lbl => lbl.style.cssText = null)
                    
                    if (formInputs[1].value.length != 0){ formData.append('new_gallery_id', formInputs[1].value) }
                    if (formInputs[2].files.length != 0){ formData.append('file', formInputs[2].files[0]) }
                    
                    if (checkbox.checked == true){
                        var metatagesInputsValues = 0
                        metatagesInputs.forEach(input => {if(input.value.length != 0) {metatagesInputsValues++}})
                        if ( metatagesInputsValues != 0 ){
                            metatagesLabels.forEach(lbl => lbl.style.cssText = null)
                            if (metatagesInputs[0].value.length != 0) { formData.append('img_size',       metatagesInputs[0].value) }
                            if (metatagesInputs[1].value.length != 0) { formData.append('name',          metatagesInputs[1].value) }
                            if (metatagesInputs[2].value.length != 0) { formData.append('shutter',       metatagesInputs[2].value) }
                            if (metatagesInputs[3].value.length != 0) { formData.append('aperture',      metatagesInputs[3].value) }
                            if (metatagesInputs[4].value.length != 0) { formData.append('date_time',      metatagesInputs[4].value) }
                            if (metatagesInputs[5].value.length != 0) { formData.append('make',          metatagesInputs[5].value) }
                            if (metatagesInputs[6].value.length != 0) { formData.append('model',         metatagesInputs[6].value) }
                            if (metatagesInputs[7].value.length != 0) { formData.append('f_number',      metatagesInputs[7].value) }
                            if (metatagesInputs[8].value.length != 0) { formData.append('lens_model',    metatagesInputs[8].value) }
                            if (metatagesInputs[9].value.length != 0) { formData.append('lens_lenth',    metatagesInputs[9].value) }
                            if (metatagesInputs[10].value.length != 0){ formData.append('img_format',    metatagesInputs[10].value) }
                            if (metatagesInputs[11].value.length != 0){ formData.append('software',      metatagesInputs[11].value) }
                            if (metatagesInputs[12].value.length != 0){ formData.append('iso_speed',     metatagesInputs[12].value) }
                        } 
                        else if ( metatagesInputsValues == 0 ) { metatagesLabels.forEach(lbl => lbl.style.cssText = labelError); alert('Most fill one metatag at least') }
                        else {return null}
                    }
                    
                    if (password[1].value.length != 0){
                        password[0].style.cssText = null
                        
                        formData.append('password', password[1].value)
                        checkbox.checked = false
                        metatagsGrp.style.cssText = 'display: none'
                        loadingBubbles.style.display = 'unset'
                        await fetch(apiUrl+'photo/'+oldPhotoId+'/edit' , {method: 'PATCH', body: formData})
                        .then(() => {
                            form.reset();
                            loadingBubbles.style.display = 'none'
                        })
                    } else {password[0].style.cssText = labelError}
                } else { formLabels.forEach( lbl => lbl.style.cssText = labelError ); alert('Most fill one of (New Gallery ID) or (New Photo) or (Edit Metatags)')}
            } else { formIdLbl.style.cssText = labelError }
            
        })// end Edit Photo
        /* end Edit Photo */

        /* Delete */
        deleteBtnList.forEach( btn => btn.addEventListener('click', async function () { 
            const formData = new FormData()
            const formInput = document.getElementById('delete-id')
            const formLabel = document.getElementById('delete-id-lbl')
            var clickedBtnTarget = null
            if ( this.id == 'delete-gallery-btn' ) { clickedBtnTarget = 'gallery/' }
            else if ( this.id == 'delete-photo-btn' ) { clickedBtnTarget = 'photo/' }
            
            if ( formInput.value.length != 0 ){
                formLabel.style.cssText = null
                if ( password[1].value.length != 0 ){
                    password[0].style.cssText = null
                    loadingBubbles.style.display = 'unset'
                    formData.append('password', password[1].value)
                    await fetch(apiUrl+clickedBtnTarget + formInput.value +'/delete' , {method: 'POST', body: formData})
                    .then(() => {
                        loadingBubbles.style.display = 'none'
                        form.reset();
                    })
                } else { password[0].style.cssText = labelError }
            } else { formLabel.style.cssText = labelError }
        }))

    }, [])

    return (
        <div className="create-container">
            <section>
                <header>
                    <Navbar>
                        <ul>
                            <li id='create-gallery-li'>Create Gallery</li>
                            <li id='create-photo-li'>Create Photo</li>
                            <li id='edit-gallery-li'>Edit Gallery</li>
                            <li id='edit-photo-li'>Edit Photo</li>
                            <li id='delete-li'>Delete</li>
                        </ul>
                    </Navbar>
                </header>
                <ReactLoading id="loading-bubbles" type="spinningBubbles" color="#ffffff" height={200} width={200} className="loading-bubbles"/>
                <Form id='full-form'>
                    <Form.Group id='create-gallery-grp'>
                        <Form.Label id='create-gallery-title-lbl' >     <span>Title:</span>          <Form.Control id='create-gallery-title' type='text' /></Form.Label>
                        <Form.Label id="create-gallery-file-lbl" >      <span>Thumnail:</span>       <Form.Control id="create-gallery-file" type="file" accept="image/*" />     </Form.Label>
                    </Form.Group>
                    <Form.Group id='create-photo-grp'>
                        <Form.Label id='create-photo-id-lbl' >          <span>Gallery ID:</span>     <Form.Control id='create-photo-gallery-id' type='number' placeholder='' /></Form.Label>
                        <Form.Label id="create-photo-file-lbl" >        <span>Photo:</span>          <Form.Control id="create-photo-file" type="file" accept="image/*" multiple /> </Form.Label>
                    </Form.Group>
                    <Form.Group id='edit-gallery-grp'>
                        <Form.Label id='edit-gallery-id-lbl' >          <span>ID:</span>             <Form.Control id='edit-gallery-id' type='number' placeholder='' /></Form.Label>
                        <Form.Label id='edit-gallery-title-lbl' >       <span>New Title:</span>      <Form.Control id='edit-gallery-title' type='text' /></Form.Label>
                        <Form.Label id="edit-gallery-file-lbl" >        <span>New Thumnail:</span>   <Form.Control id="edit-gallery-file" type="file" accept="image/*" />     </Form.Label>
                    </Form.Group>

                    <Form.Group id='edit-photo-grp'>
                        <Form.Label id='edit-photo-id-lbl' >            <span>ID:</span>             <Form.Control id='edit-photo-id' type='number' placeholder='' /></Form.Label>
                        <Form.Label id='edit-photo-gallery-id-lbl' >    <span>New Gallery ID:</span> <Form.Control id='edit-photo-gallery-id' type='number' placeholder='' /></Form.Label>
                        <Form.Label id="edit-photo-file-lbl" >          <span>New Photo:</span>      <Form.Control id="edit-photo-file" type="file" accept="image/*" /> </Form.Label>
                        
                        <Form.Label id='edit-metatags-checkbox-lbl' >   <span>Edit Metatags?</span>  <Form.Control id='edit-metatags-checkbox' type="checkbox"/></Form.Label>
                        <Form.Group id='edit-photo-metatags-grp'>
                            <Form.Label id='edit-photo-imgsize-lbl' >   <span>New img_size:</span>   <Form.Control id='edit-photo-imgsize' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-name-lbl' >      <span>New name:</span>       <Form.Control id='edit-photo-name' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-shutter-lbl' >   <span>New shutter:</span>    <Form.Control id='edit-photo-shutter' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-aperture-lbl' >  <span>New aperture:</span>   <Form.Control id='edit-photo-aperture' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-datetime-lbl' >  <span>New date_time:</span>  <Form.Control id='edit-photo-datetime' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-make-lbl' >      <span>New make:</span>       <Form.Control id='edit-photo-make' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-model-lbl' >     <span>New model:</span>      <Form.Control id='edit-photo-model' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-fnumber-lbl' >   <span>New f_number:</span>   <Form.Control id='edit-photo-fnumber' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-lensmodel-lbl' > <span>New lens_model:</span> <Form.Control id='edit-photo-lensmodel' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-lenslenth-lbl' > <span>New lens_lenth:</span> <Form.Control id='edit-photo-lenslenth' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-imgformat-lbl' > <span>New img_format:</span> <Form.Control id='edit-photo-imgformat' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-software-lbl' >  <span>New software:</span>   <Form.Control id='edit-photo-software' type='text' /></Form.Label>
                            <Form.Label id='edit-photo-isospeed-lbl' >  <span>New iso_speed:</span>  <Form.Control id='edit-photo-isospeed' type='text' /></Form.Label>
                        </Form.Group>
                    
                    </Form.Group>
                    <Form.Group id='delete-grp'>
                        <Form.Label id='delete-id-lbl' > <span>ID:</span> <Form.Control id='delete-id' type='number' placeholder='' /></Form.Label>
                    </Form.Group>
                    <Form.Label id="password-lbl" > <span>Password:</span> <Form.Control id="password" type="password" /></Form.Label>
                    
                    <Form.Group className='form-btns'>
                        <Button id='create-gallery-btn' >Create Gallery</Button>
                        <Button id='create-photo-btn'   >Create Photo</Button>
                        <Button id='edit-gallery-btn'   >Edit Gallery</Button>
                        <Button id='edit-photo-btn'     >Edit Photo</Button>
                        <Form.Group id='delete-btns'>
                            <Button id='delete-gallery-btn' name='ddddddddddddddddd'>Delete Gallery</Button>
                            <Button id='delete-photo-btn'   >Delete Photo</Button>
                        </Form.Group>
                    </Form.Group>
                </Form>
            </section>
            <Footer />
        </div>
    );
}
export default Manage;
