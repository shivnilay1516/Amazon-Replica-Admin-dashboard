"use client"
import React, { FormEvent, useState } from 'react'
import PageBreadcrumb from '../common/PageBreadcrumb'
// import DefaultInputs from '../form/form-elements/DefaultInputs'
// import InputGroup from '../form/form-elements/InputGroup'
// import FileInputExample from '../form/form-elements/FileInputExample'
import ComponentCard from '../common/ComponentCard'
import Label from '../form/Label'
import Input from '../form/input/InputField'
import FileInput from '../form/input/FileInput'
import Button from '../ui/button/Button'
import { toast } from 'react-toastify'
import Select from '../form/Select'

const headerfootersetting = () => {
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')
    const [textColor, setTextColor] = useState('#000000')
    const [headerLogo, setHeaderLogo] = useState<File | null>(null)
    const [footerLogo, setFooterLogo] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!headerLogo || !footerLogo) 
        {
            console.log("Please upload both logos.")
            return toast.info('Please upload both logos.');
        }
    
        setLoading(true)
    
        const operations = {
          query: `
            mutation AddHomePageSetting($input: HomePageSettingInput!) {
              addHomePageSetting(input: $input) {
                id
                backgroundcolor
                textcolor
                headerlogo
                footerlogo
              }
            }
          `,
          variables: {
            input: {
              backgroundcolor: backgroundColor,
              textcolor: textColor,
              headerlogo: null,
              footerlogo: null,
            },
          },
        }
    
        const map = {
          "0": ["variables.input.headerlogo"],
          "1": ["variables.input.footerlogo"],
        }
    
        const formData = new FormData()
        formData.append("operations", JSON.stringify(operations))
        formData.append("map", JSON.stringify(map))
        formData.append("0", headerLogo)
        formData.append("1", footerLogo)
    
        try {
          const response = await fetch('https://cb94-103-206-131-194.ngrok-free.app/graphql', {
            method: 'POST',
            body: formData,
          })
    
          const result = await response.json()
          console.log('✅ Success:', result)
        //   alert('Home page settings saved!')
          toast.success('Home page settings saved! ✅');
        } catch (error) {
          console.error('❌ Error:', error)
          toast.error('Something went wrong');
        } finally {
          setLoading(false)
        }
      }
      const options = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ];
      const optionstop = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ];
  return (
   <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
        <ComponentCard title="Home Page Setting">
      <form onSubmit={handleSubmit} >
        <div className="flex justify-between flex-wrap">
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Header Background Color</Label>
          <Input 
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Header Color</Label>
          <Input 
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Footer Top Background Color</Label>
          <Input 
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Footer Top Color</Label>
          <Input 
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Footer Color</Label>
          <Input 
            type="color"
            defaultValue={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)} />
        </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
        <Label>Header Logo</Label>
        <FileInput
         className="custom-class"
         onChange={(e) =>
            e.target.files && setHeaderLogo(e.target.files[0])
        }
          />
      </div>
       <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
        <Label>Footer Logo</Label>
        <FileInput 
        className="custom-class"
        onChange={(e) =>
            e.target.files && setFooterLogo(e.target.files[0])
        } />
      </div>
     <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Footer Status</Label>
          <Select options={options} onChange={()=>{}}/>
        </div>
     <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>Footer Top Status</Label>
          <Select options={optionstop} onChange={()=>{}}/>
        </div>
     <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>resStatus</Label>
          <Input
          type="color"
          defaultValue={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
     <div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
          <Label>resMessage</Label>
          <Input
          type="color"
          defaultValue={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          />
        </div>
        </div>
        <div className="flex justify-center mt-4">
        <Button size="sm" variant="primary">
        {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
      </form>
    </ComponentCard>
        </div>
      </div>
    </div>
  )
}

export default headerfootersetting


{/* <form onSubmit={handleSubmit} className="flex justify-between items-center flex-wrap">
<div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
  <Label>Header Background Color</Label>
  <Input 
    type="color"
    defaultValue={backgroundColor}
    onChange={(e) => setBackgroundColor(e.target.value)} />
</div>
<div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
<Label>Footer Logo</Label>
<FileInput 
className="custom-class"
onChange={(e) =>
    e.target.files && setFooterLogo(e.target.files[0])
} />
</div>
<div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
  <Label>Text Color</Label>
  <Input
  type="color"
  defaultValue={textColor}
  onChange={(e) => setTextColor(e.target.value)}
  />
</div>
<div className="lg:w-[48%] md:w-[100%] sm:w-[100%] w-[100%] my-2">
<Label>Header Logo</Label>
<FileInput
 className="custom-class"
 onChange={(e) =>
    e.target.files && setHeaderLogo(e.target.files[0])
}
  />
</div>

<div className="flex justify-center">
<Button size="sm" variant="primary">
{loading ? 'Submitting...' : 'Submit'}
</Button>
</div>
</form> */}