'use client'

const Input = ({ label, name, type = 'text', placeholder, value, onChange, required = true, divClass = "" }: any) => (
  <div className={`flex flex-col gap-2 ${divClass}`}>
    <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] px-1">
      {label} {required && <span className="text-[#00386c]">*</span>}
    </label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="bg-[#f5f3f3] border-none rounded-2xl p-4 text-sm font-medium text-[#1b1c1c] placeholder:text-[#a4a8ae] focus:ring-2 focus:ring-[#00386c]/20 focus:bg-white transition-all outline-none"
    />
  </div>
)

export default function CheckoutForm({ formData, setFormData }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-12">
      {/* Sección 1: Contacto */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 rounded-full bg-[#00386c] text-white flex items-center justify-center text-sm font-black">1</span>
          <h3 className="text-xl font-black text-[#1b1c1c] tracking-tight">Información de Contacto</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Correo Electrónico" 
            name="email" 
            type="email" 
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input 
            label="Teléfono (WhatsApp)" 
            name="telefono" 
            type="tel" 
            placeholder="10 dígitos"
            value={formData.telefono}
            onChange={handleChange}
          />
          <Input 
            label="Nombre Completo" 
            name="nombre" 
            placeholder="Como aparece en INE"
            divClass="md:col-span-2"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Sección 2: Dirección de Envío */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <span className="w-10 h-10 rounded-full bg-[#00386c] text-white flex items-center justify-center text-sm font-black">2</span>
          <h3 className="text-xl font-black text-[#1b1c1c] tracking-tight">Dirección de Entrega</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          <Input 
            label="Código Postal" 
            name="cp" 
            placeholder="00000"
            divClass="md:col-span-2"
            value={formData.cp}
            onChange={handleChange}
          />
          <Input 
            label="Estado" 
            name="estado" 
            placeholder="Ej: Morelos"
            divClass="md:col-span-2"
            value={formData.estado}
            onChange={handleChange}
          />
          <Input 
            label="Ciudad / Municipio" 
            name="ciudad" 
            placeholder="Ej: Cuernavaca"
            divClass="md:col-span-2"
            value={formData.ciudad}
            onChange={handleChange}
          />
          
          <Input 
            label="Calle" 
            name="calle" 
            placeholder="Nombre de la vialidad"
            divClass="md:col-span-6"
            value={formData.calle}
            onChange={handleChange}
          />

          <Input 
            label="Num. Exterior" 
            name="numExt" 
            placeholder="123"
            divClass="md:col-span-2"
            value={formData.numExt}
            onChange={handleChange}
          />
          <Input 
            label="Num. Interior (Opcional)" 
            name="numInt" 
            placeholder="Depto / Int"
            required={false}
            divClass="md:col-span-2"
            value={formData.numInt}
            onChange={handleChange}
          />
          <Input 
            label="Colonia" 
            name="colonia" 
            placeholder="Nombre del fraccionamiento"
            divClass="md:col-span-2"
            value={formData.colonia}
            onChange={handleChange}
          />

          <div className="md:col-span-6 flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#74787e] uppercase tracking-[0.2em] px-1">
              Referencias y Notas de Entrega
            </label>
            <textarea
              name="referencias"
              rows={3}
              placeholder="Ej: Portón café, junto a la tienda de abarrotes..."
              value={formData.referencias}
              onChange={handleChange}
              className="bg-[#f5f3f3] border-none rounded-2xl p-4 text-sm font-medium text-[#1b1c1c] placeholder:text-[#a4a8ae] focus:ring-2 focus:ring-[#00386c]/20 focus:bg-white transition-all outline-none resize-none"
            />
          </div>
        </div>
      </section>

      {/* Nota de Seguridad */}
      <div className="bg-[#c1ebb5]/10 p-6 rounded-[2rem] border border-[#c1ebb5]/20 flex items-start gap-4">
        <div className="text-[#43673c] mt-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <p className="text-xs text-[#44494e] leading-relaxed">
          Tus datos personales están seguros. Utilizamos encriptación de grado bancario para proteger tu información durante todo el proceso de compra.
        </p>
      </div>
    </div>
  )
}
