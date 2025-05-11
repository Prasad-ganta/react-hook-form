"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { ImageUpload } from "./components/ImageUpload"
import { CustomizationForm } from "./components/CustomizationForm"
import { TShirtPreview } from "./components/TShirtPreview"
import "./App.css"

const themes = ["classic", "dark", "vibrant"]

export default function App() {
  const [currentTheme, setCurrentTheme] = useState("classic")
  const [uploadedImage, setUploadedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState("/placeholder.svg?height=300&width=300")
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      height: 180,
      weight: 80,
      build: "athletic",
      customText: "",
    },
  })

  // Watch form values for real-time preview
  const height = watch("height")
  const weight = watch("weight")
  const build = watch("build")
  const customText = watch("customText")

  // Handle theme switching with Alt+Q
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "q") {
        setCurrentTheme((prev) => {
          const currentIndex = themes.indexOf(prev)
          const nextIndex = (currentIndex + 1) % themes.length
          return themes[nextIndex]
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
    // In a real app, this would send the data to a backend
    alert("T-shirt customization saved! (This would normally be sent to a backend)")
  }

  const handleImageUpload = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(file)
      setPreviewImage(imageUrl)
    }
  }

  return (
    <div className={`app-container ${currentTheme}`}>
      <div className="customizer-container">
        <div className="left-panel">
          <TShirtPreview image={previewImage} customText={customText} theme={currentTheme} />
        </div>

        <div className="right-panel">
          <h1>T-Shirt Customizer</h1>
          <p className="theme-info">Current theme: {currentTheme} (Press Alt+Q to switch)</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CustomizationForm register={register} errors={errors} theme={currentTheme} />

            <div className="upload-section">
              <h2>Upload Design</h2>
              <ImageUpload onImageUpload={handleImageUpload} currentImage={previewImage} theme={currentTheme} />
            </div>

            <div className="text-section">
              <h2>Custom Text</h2>
              <textarea
                {...register("customText", { maxLength: 100 })}
                placeholder="Enter text to print on your t-shirt (max 3 lines)"
                rows={3}
                className="custom-text-input"
              />
              {errors.customText && <span className="error">Text is too long</span>}
            </div>

            <button type="submit" className="submit-button">
              Save Customization
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
