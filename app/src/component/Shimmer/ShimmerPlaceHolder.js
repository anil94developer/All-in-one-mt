import React from 'react';
import {View, ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { screenHeight, screenWidth } from '../../constants/Sizes.constant';
// import {height, width} from '../styles/style';

const SliderShimmer = () => {
  return (
    <View style={{marginBottom: 16}}>
      <SkeletonPlaceholder borderRadius={20}>
        <SkeletonPlaceholder.Item
          height={screenHeight / 7}
          width={screenWidth/3.2}
          marginHorizontal={20}
          borderRadius={200}
          alignSelf='center'
          marginTop={20}
        />
        <SkeletonPlaceholder.Item marginTop={10} alignSelf='center' >
          <SkeletonPlaceholder.Item height={20} width={screenWidth/2} marginHorizontal={20} />
          <SkeletonPlaceholder.Item height={20} alignSelf='center' width={screenWidth/3} marginHorizontal={20} marginTop={20} />
          {/* <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-evenly">
            <SkeletonPlaceholder.Item
              height={20}
              width={20}
              marginVertical={10}
              borderRadius={2}
            />
            <SkeletonPlaceholder.Item
              height={20}
              marginHorizontal={10}
              width={120}
              marginVertical={10}
            />
            <SkeletonPlaceholder.Item
              height={20}
              marginHorizontal={20}
              width={20}
              marginVertical={10}
              alignSelf="flex-end"
            />
            <SkeletonPlaceholder.Item
              height={20}
              width={40}
              marginVertical={10}
              alignSelf="flex-end"
            />
          </SkeletonPlaceholder.Item> */}
          {/* <SkeletonPlaceholder.Item
            height={20}
            marginVertical={10}
            marginHorizontal={20}
            width={120}
          />
          <SkeletonPlaceholder.Item
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginVertical={10}
            marginHorizontal={20}>
            <SkeletonPlaceholder.Item flexDirection="row">
              <SkeletonPlaceholder.Item
                height={20}
                width={40}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                height={20}
                width={40}
                borderRadius={10}
                marginHorizontal={10}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                height={30}
                width={30}
                borderRadius={10}
                marginHorizontal={10}
                alignSelf="flex-end"
              />
            </SkeletonPlaceholder.Item> */}
          {/* </SkeletonPlaceholder.Item> */}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};
// const SliderShimmerMyBooking = () => {
//   return (
//     <View style={{marginBottom: 16}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item marginTop={10}>
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="space-between"
//             marginTop={10}
//             marginHorizontal={20}>
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={150}
//               borderRadius={5}
//             />
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={150}
//               borderRadius={5}
//             />
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             marginHorizontal={20}
//             width={280}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             marginHorizontal={20}
//             width={200}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="space-between"
//             marginTop={10}
//             marginHorizontal={20}>
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={150}
//               borderRadius={5}
//             />
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={150}
//               borderRadius={5}
//             />
//           </SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="space-between"
//             marginTop={10}
//             marginHorizontal={20}>
//             <SkeletonPlaceholder.Item
//               height={50}
//               width={170}
//               borderRadius={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={50}
//               width={170}
//               borderRadius={10}
//             />
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };
// const SliderShimmerBookingDetail = () => {
//   return (
//     <ScrollView style={{marginBottom: 16}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item marginTop={16} marginHorizontal={20}>
//           <SkeletonPlaceholder.Item height={20} width={150} borderRadius={10} />
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={250}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={250}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="flex-start"
//             alignItems="center"
//             marginTop={10}>
//             <SkeletonPlaceholder.Item flexDirection="row">
//               <SkeletonPlaceholder.Item
//                 height={30}
//                 width={30}
//                 borderRadius={10}
//               />
//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={100}
//                 borderRadius={10}
//                 marginHorizontal={10}
//               />
//             </SkeletonPlaceholder.Item>
//             <SkeletonPlaceholder.Item flexDirection="row">
//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={50}
//                 borderRadius={10}
//               />
//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={100}
//                 borderRadius={10}
//                 marginHorizontal={10}
//               />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//           </SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={150}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//           </SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={150}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//           </SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={150}
//             borderRadius={10}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="flex-start">
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={150}
//               borderRadius={10}
//             />
//           </SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginVertical={10}
//             width={150}
//             borderRadius={10}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </ScrollView>
//   );
// };
// const SliderShimmerHomeDetail = () => {
//   return (
//     <View style={{marginBottom: 16}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item height={height / 3} borderRadius={4} />
//         <SkeletonPlaceholder.Item marginTop={10}>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginHorizontal={20}
//             width={250}
//           />

//           <SkeletonPlaceholder.Item
//             height={30}
//             marginVertical={10}
//             marginHorizontal={20}
//             width={200}
//           />
//           <SkeletonPlaceholder.Item
//             flexDirection="row"
//             justifyContent="space-between"
//             alignItems="center"
//             marginVertical={10}
//             marginHorizontal={20}>
//             <SkeletonPlaceholder.Item flexDirection="row">
//               <SkeletonPlaceholder.Item
//                 height={30}
//                 width={30}
//                 borderRadius={15}
//               />
//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={250}
//                 marginHorizontal={10}
//                 marginTop={5}
//               />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>
//         <SkeletonPlaceholder.Item
//           height={50}
//           borderRadius={10}
//           marginHorizontal={20}
//         />
//         <SkeletonPlaceholder.Item
//           flexDirection="row"
//           marginHorizontal={20}
//           marginTop={10}>
//           <SkeletonPlaceholder.Item height={30} width={30} borderRadius={15} />
//           <SkeletonPlaceholder.Item
//             height={30}
//             width={50}
//             marginHorizontal={10}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };
// const SliderShimmerOfferDetail = () => {
//   return (
//     <ScrollView style={{marginBottom: 16}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           height={height / 3}
//           marginHorizontal={20}
//           marginVertical={20}
//           borderRadius={10}
//         />
//         <SkeletonPlaceholder.Item>
//           <SkeletonPlaceholder.Item
//             height={40}
//             marginHorizontal={20}
//             borderRadius={8}
//           />

//           <SkeletonPlaceholder.Item
//             height={20}
//             marginVertical={10}
//             marginHorizontal={20}
//             width={100}
//             borderRadius={5}
//           />
//           <SkeletonPlaceholder.Item
//             height={20}
//             marginHorizontal={20}
//             marginTop={10}
//             borderRadius={5}
//           />
//           <SkeletonPlaceholder.Item
//             height={300}
//             marginHorizontal={20}
//             marginTop={10}
//             borderRadius={10}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </ScrollView>
//   );
// };

// const SliderShimmerNotification = () => {
//   return (
//     <View style={{marginBottom: 16}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           height={height / 7}
//           marginHorizontal={20}
//           borderRadius={20}
//         />
       
//       </SkeletonPlaceholder>
//     </View>
//   );
// };
// const MatchCardShimmer = () => {
//   return (
//     <View style={{marginBottom: 20}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item flexDirection="row" padding={20} height={180}>
//           <SkeletonPlaceholder.Item
//             height={150}
//             width={150}
//             borderRadius={15}
//           />
//           <SkeletonPlaceholder.Item paddingHorizontal={20} paddingVertical={10}>
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={150}
//               borderRadius={5}
//             />

//             <SkeletonPlaceholder.Item
//               height={20}
//               width={120}
//               borderRadius={5}
//               marginTop={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={40}
//               width={180}
//               borderRadius={5}
//               marginTop={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={20}
//               width={180}
//               borderRadius={5}
//               marginTop={10}
//             />
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };
// const CategoryCardShimmer = () => {
//   return (
//     <View>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           flexDirection="row"
//           marginHorizontal={10}
//           justifyContent="flex-start"
//           alignItems="center"
//           marginVertical={10}>
//           <SkeletonPlaceholder.Item
//             height={30}
//             width={30}
//             borderRadius={5}
//             marginHorizontal={10}
//           />

//           <SkeletonPlaceholder.Item
//             height={30}
//             width={100}
//             borderRadius={5}
//             //   marginTop={10}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// const CourtCardShimmer = () => {
//   return (
//     <View>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item height={height / 2.5}>
//           <SkeletonPlaceholder.Item height={height / 6} marginHorizontal={15} />

//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item>
//               <SkeletonPlaceholder.Item
//                 height={30}
//                 width={width / 2}
//                 margin={5}
//                 borderRadius={5}
//                 marginHorizontal={15}
//               />

//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={width / 2.5}
//                 margin={5}
//                 borderRadius={5}
//                 marginHorizontal={15}
//               />
//             </SkeletonPlaceholder.Item>

//             <SkeletonPlaceholder.Item
//               height={40}
//               width={30}
//               margin={5}
//               marginLeft={width / 4}
//               borderRadius={5}
//             />
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             height={10}
//             borderRadius={5}
//             margin={5}
//             marginHorizontal={15}
//           />

//           <SkeletonPlaceholder.Item
//             height={50}
//             borderRadius={5}
//             margin={5}
//             marginHorizontal={15}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// const FacilityShimmer = () => {
//   return (
//     <View>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item height={height / 2.5}>
//           <SkeletonPlaceholder.Item height={height / 6} marginHorizontal={15} />

//           <SkeletonPlaceholder.Item flexDirection="row">
//             <SkeletonPlaceholder.Item>
//               <SkeletonPlaceholder.Item
//                 height={30}
//                 width={width / 2}
//                 margin={5}
//                 borderRadius={5}
//                 marginHorizontal={15}
//               />

//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={width / 2.5}
//                 margin={5}
//                 borderRadius={5}
//                 marginHorizontal={15}
//               />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             height={10}
//             borderRadius={5}
//             margin={5}
//             marginHorizontal={15}
//           />

//           <SkeletonPlaceholder.Item
//             height={50}
//             borderRadius={5}
//             margin={5}
//             marginHorizontal={15}
//           />
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// const AllCourtShimmer = () => {
//   return (
//     <View>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           height={height / 5}
//           // flexDirection={'row'}
//           // alignSelf='center'
//           padding={10}>
//           <SkeletonPlaceholder.Item height={height / 6} width={width / 3} borderRadius={100} alignSelf='center' />

//             <SkeletonPlaceholder.Item
//               height={20}
//               width={width / 2.5}
//               margin={5}
//               alignSelf='center'
//             />

//             <SkeletonPlaceholder.Item
//               height={10}
//               margin={5}
//               width={width / 2}
//               alignSelf='center'
//             />

//             <SkeletonPlaceholder.Item
//               height={10}
//               margin={5}
//               width={width / 5}
//               alignSelf='center'
//             />
//             <SkeletonPlaceholder.Item
//               height={50}
//               margin={5}
//               width={width-20}
//               alignSelf='center'
//               marginTop={15}
//             />
//             {/* <SkeletonPlaceholder.Item
//               height={50}
//               margin={5}
//               width={width-20}
//               alignSelf='center'
//               marginTop={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={50}
//               margin={5}
//               width={width-20}
//               alignSelf='center'
//               marginTop={10}
//             />
//             <SkeletonPlaceholder.Item
//               height={50}
//               margin={5}
//               width={width-20}
//               alignSelf='center'
//               marginTop={10}
//             /> */}

            
//           </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// const MyBookingShimmer = () => {
//   return (
//     <View>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item height={height / 3}>
//           <SkeletonPlaceholder.Item flexDirection={'row'} padding={10}>
//             <SkeletonPlaceholder.Item height={height / 6} width={width / 2.5} />

//             <SkeletonPlaceholder.Item margin={10}>
//               <SkeletonPlaceholder.Item
//                 height={20}
//                 width={width / 2.5}
//                 margin={5}
//               />

//               <SkeletonPlaceholder.Item
//                 height={10}
//                 margin={5}
//                 width={width / 2}
//               />

//               <SkeletonPlaceholder.Item
//                 height={10}
//                 margin={5}
//                 width={width / 5}
//               />

//               <SkeletonPlaceholder.Item
//                 height={10}
//                 margin={5}
//                 marginTop={20}
//                 width={width / 3}
//               />

//               <SkeletonPlaceholder.Item
//                 height={10}
//                 margin={5}
//                 width={width / 3}
//               />
//             </SkeletonPlaceholder.Item>
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             height={2}
//             alignSelf="center"
//             width={width - 20}
//           />

//           <SkeletonPlaceholder.Item
//             width={width - 20}
//             flexDirection="row"
//             alignSelf="center"
//             marginTop={5}
//             justifyContent="space-between">
//             <SkeletonPlaceholder.Item width={50} height={30} />

//             <SkeletonPlaceholder.Item width={80} height={30} />
//           </SkeletonPlaceholder.Item>

//           <SkeletonPlaceholder.Item
//             width={width - 20}
//             flexDirection="row"
//             justifyContent="space-between">
//             <SkeletonPlaceholder.Item
//               width={width / 2 - 20}
//               height={30}
//               margin={10}
//             />
//             <SkeletonPlaceholder.Item
//               width={width / 2 - 20}
//               height={30}
//               margin={10}
//             />
//           </SkeletonPlaceholder.Item>
//         </SkeletonPlaceholder.Item>
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

// const SliderShimmerMyCard = () => {
//   return (
//     <View style={{}}>
//       <SkeletonPlaceholder>
//         <SkeletonPlaceholder.Item
//           height={220}
//           marginHorizontal={20}
//           marginTop={10}
//           borderRadius={20}
//         />
//       </SkeletonPlaceholder>
//     </View>
//   );
// };

export {
  SliderShimmer,
//   MatchCardShimmer,
//   CourtCardShimmer,
//   FacilityShimmer,
//   AllCourtShimmer,
//   MyBookingShimmer,
//   CategoryCardShimmer,
//   SliderShimmerHomeDetail,
//   SliderShimmerOfferDetail,
//   SliderShimmerMyBooking,
//   SliderShimmerBookingDetail,
//   SliderShimmerMyCard,
//   SliderShimmerNotification,
};
