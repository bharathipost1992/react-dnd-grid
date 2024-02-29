import * as React from 'react'
import {data} from './json'
import './style.css'

const ExpandIcon = React.memo(({handleExpand, width, index}) => {
    if(width === 12) return null;
    return <div onClick={() => handleExpand(index)} className='border'>{'Expand'}</div>
})

const CollapseIcon = React.memo(({handleCollapse, width, index}) => {
    if(width !== 12) return null;
    return <div onClick={() => handleCollapse(index)} className='border'>{'Collapse'}</div>
})

// saveData is used to pass information to the parent component
// gridData is the entire grid data
const Container = ({gridData = data, saveData}) => {
    const [datum, setDatum] = React.useState(gridData)

    const handleCollapse = (index) => {
        const tempData = [...datum]
        tempData[index]['width'] = 6
        setDatum([...tempData])
    }
    const handleExpand = (index) => {
        const tempData = [...datum]
        tempData[index]['width'] = 12
        setDatum([...tempData])
    }

    const dragStart = (event, startIndex) => {
        event.dataTransfer.setData("source", startIndex)
    }

    const dragEnd = (event, targetIndex) => {
        const sourceIndex = event.dataTransfer.getData("source")
        const tempData = [...datum];
        [tempData[sourceIndex], tempData[targetIndex]] = [tempData[targetIndex], tempData[sourceIndex]];
        setDatum([...tempData]);
        if(saveData)
            saveData(tempData)
    }

    const onDragOver = (e) => {
        e.preventDefault()
    }
    
    return (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)'}}>
            {datum.map((item, index)=>{
                return (
                    <div 
                    className='box' 
                    onDragOver={(ev)=>onDragOver(ev)} 
                    onDrop={(ev) => dragEnd(ev, index)} 
                    onDragStart={(ev) => dragStart(ev, index)} 
                    style={{gridColumn: `span ${item.width}`}} 
                    draggable>
                        <header>
                            <span>{item.label}</span>
                            <CollapseIcon width={item.width} handleCollapse={handleCollapse} index={index} />
                            <ExpandIcon width={item.width} handleExpand={handleExpand} index={index} />
                        </header>
                        <div className='datum'>
                        {item.node}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default Container;