export const cpfInputMask = (cpf:string):string=>{
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
}


export const inputDate = (date:string):string=>{
    return date.replace(/(\d{2})(\d{2})/g, '$1/$2')
}


export const cepInputMask = (cep:string):string=>{
    return cep.replace(/(\d{2})(\d{3})(\d{3})/g, '$1.$2-$3')
}


export const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
        'Backspace',
        'Delete',
        'Tab',
        'Escape',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End'
    ]

    if(allowedKeys.includes(e.key)) return

    if(e.ctrlKey || e.metaKey) return

    if(!/^[0-9]$/.test(e.key)) e.preventDefault()
}

export const handleKeydown = (e:KeyboardEvent)=>{
    if(e.key === 'Escape' || e.key === 'Esc'){
        alert('Só pra ver')
    }
}


export const formatPhoneNumber = (phone:string)=>{
    const digits = phone.replace(/\D/g, '')

    if(digits.length <= 10){
        return digits.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3')
    }

    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3')
}